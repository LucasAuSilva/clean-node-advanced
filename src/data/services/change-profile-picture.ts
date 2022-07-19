import { Profile } from '@/domain/models/profile'
import { DeleteFile, UploadFile } from '@/data/contracts/file-storage'
import { UUIDGenerator } from '@/data/contracts/crypto'
import { LoadProfileById, SaveProfilePicture } from '@/data/contracts/repositories/profile'

export class ChangeProfilePicture {
  constructor (
    private readonly fileStorage: UploadFile & DeleteFile,
    private readonly uniqueId: UUIDGenerator,
    private readonly profileRepo: SaveProfilePicture & LoadProfileById
  ) {}

  async perform ({ id, file }: ChangeProfilePictureDto): Promise<ChangeProfilePictureResult> {
    const uuid = this.uniqueId.generate(id)
    let pictureUrl: string | undefined
    let name: string | undefined
    if (file !== undefined) {
      pictureUrl = await this.fileStorage.upload(file, uuid)
    } else {
      name = await this.profileRepo.loadById(id)
    }
    const profile = new Profile(id)
    profile.setPicture(pictureUrl, name)
    try {
      await this.profileRepo.savePicture(profile.id, profile.pictureUrl, profile.initials)
    } catch {
      await this.fileStorage.delete(uuid)
    }
    return profile
  }
}

type ChangeProfilePictureDto = { id: string, file?: Buffer }
type ChangeProfilePictureResult = { pictureUrl?: string, initials?: string }

import { Profile } from '@/domain/models/profile'
import { UploadFile } from '@/data/contracts/file-storage'
import { UUIDGenerator } from '@/data/contracts/crypto'
import { LoadProfileById, SaveProfilePicture } from '@/data/contracts/repositories/profile'

export class ChangeProfilePicture {
  constructor (
    private readonly fileStorage: UploadFile,
    private readonly uniqueId: UUIDGenerator,
    private readonly profileRepo: SaveProfilePicture & LoadProfileById
  ) {}

  async perform ({ id, file }: ChangeProfilePictureDto): Promise<ChangeProfilePictureResult> {
    let pictureUrl: string | undefined
    let name: string | undefined
    if (file !== undefined) {
      const uuid = this.uniqueId.generate(id)
      pictureUrl = await this.fileStorage.upload(file, uuid)
    } else {
      name = await this.profileRepo.loadById(id)
    }
    const profile = new Profile(id)
    profile.setPicture(pictureUrl, name)
    await this.profileRepo.savePicture(profile.id, profile.pictureUrl, profile.initials)
    return profile
  }
}

type ChangeProfilePictureDto = { id: string, file?: Buffer }
type ChangeProfilePictureResult = { pictureUrl?: string, initials?: string }

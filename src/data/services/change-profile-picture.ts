import { Profile } from '@/domain/models/profile'
import { ChangeProfilePicture, ChangeProfilePictureDto, ChangeProfilePictureResult } from '@/domain/features/change-profile-picture'
import { DeleteFile, UploadFile } from '@/data/contracts/file-storage'
import { UUIDGenerator } from '@/data/contracts/crypto'
import { LoadProfileById, SaveProfilePicture } from '@/data/contracts/repositories/profile'

export class ChangeProfilePictureService implements ChangeProfilePicture {
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
      const extension = file.mimeType.split('/')[1]
      pictureUrl = await this.fileStorage.upload(file.buffer, `${uuid}.${extension}`)
    } else {
      name = await this.profileRepo.loadById(id)
    }
    const profile = new Profile(id)
    profile.setPicture(pictureUrl, name)
    try {
      await this.profileRepo.savePicture(profile.id, profile.pictureUrl, profile.initials)
    } catch (error) {
      if (file !== undefined) await this.fileStorage.delete(uuid)
      throw error
    }
    return profile
  }
}

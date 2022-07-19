import { UploadFile } from '@/data/contracts/file-storage'
import { UUIDGenerator } from '@/data/contracts/crypto'
import { LoadProfileById, SaveProfilePicture } from '@/data/contracts/repositories/profile'

export class ChangeProfilePicture {
  constructor (
    private readonly fileStorage: UploadFile,
    private readonly uniqueId: UUIDGenerator,
    private readonly profileRepo: SaveProfilePicture & LoadProfileById
  ) {}

  async perform ({ id, file }: ChangeProfilePictureDto): Promise<void> {
    let pictureUrl: string | undefined
    if (file !== undefined) {
      const uuid = this.uniqueId.generate(id)
      pictureUrl = await this.fileStorage.upload(file, uuid)
    } else {
      await this.profileRepo.loadById(id)
    }
    await this.profileRepo.savePicture(pictureUrl)
  }
}

type ChangeProfilePictureDto = { id: string, file?: Buffer }

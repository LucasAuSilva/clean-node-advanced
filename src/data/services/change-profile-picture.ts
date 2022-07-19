import { UploadFile } from '@/data/contracts/file-storage'
import { UUIDGenerator } from '@/data/contracts/crypto'

export class ChangeProfilePicture {
  constructor (
    private readonly fileStorage: UploadFile,
    private readonly uniqueId: UUIDGenerator
  ) {}

  async perform ({ id, file }: ChangeProfilePictureDto): Promise<void> {
    const uuid = this.uniqueId.generate(id)
    await this.fileStorage.upload(file, uuid)
  }
}

type ChangeProfilePictureDto = { id: string, file: Buffer }

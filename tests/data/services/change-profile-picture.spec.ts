import { mock } from 'jest-mock-extended'

class ChangeProfilePicture {
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

interface UploadFile {
  upload: (file: Buffer, key: string) => Promise<void>
}

interface UUIDGenerator {
  generate: (key: string) => string
}

describe('Change Profile Picture', () => {
  const file = Buffer.from('any_buffer')
  const uuid = 'any_unique_id'

  it('should call UploadFile with correct values', async () => {
    const fileStorage = mock<UploadFile>()
    const uniqueId = mock<UUIDGenerator>()
    uniqueId.generate.mockReturnValueOnce(uuid)
    const sut = new ChangeProfilePicture(fileStorage, uniqueId)
    await sut.perform({ id: 'any_id', file })
    expect(fileStorage.upload).toHaveBeenCalledWith(file, uuid)
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})

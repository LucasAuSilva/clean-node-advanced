import { mock, MockProxy } from 'jest-mock-extended'

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

type SutTypes = {
  sut: ChangeProfilePicture
  fileStorage: MockProxy<UploadFile>
  uniqueId: MockProxy<UUIDGenerator>
}

const makeSut = (): SutTypes => {
  const uniqueId = mock<UUIDGenerator>()
  uniqueId.generate.mockReturnValueOnce('any_unique_id')
  const fileStorage = mock<UploadFile>()
  const sut = new ChangeProfilePicture(fileStorage, uniqueId)
  return {
    sut,
    fileStorage,
    uniqueId
  }
}

describe('Change Profile Picture', () => {
  const file = Buffer.from('any_buffer')
  const uuid = 'any_unique_id'

  it('should call UploadFile with correct values', async () => {
    const { sut, fileStorage } = makeSut()
    await sut.perform({ id: 'any_id', file })
    expect(fileStorage.upload).toHaveBeenCalledWith(file, uuid)
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})

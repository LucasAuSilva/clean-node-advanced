import { mock } from 'jest-mock-extended'

class ChangeProfilePicture {
  constructor (
    private readonly fileStorage: UploadFile
  ) {}

  async perform ({ id, file }: ChangeProfilePictureDto): Promise<void> {
    await this.fileStorage.upload(file, id)
  }
}

type ChangeProfilePictureDto = { id: string, file: Buffer }

interface UploadFile {
  upload: (file: Buffer, key: string) => Promise<void>
}

describe('Change Profile Picture', () => {
  const file = Buffer.from('any_buffer')
  it('should call UploadFile with correct values', async () => {
    const fileStorage = mock<UploadFile>()
    const sut = new ChangeProfilePicture(fileStorage)
    await sut.perform({ id: 'any_id', file })
    expect(fileStorage.upload).toHaveBeenCalledWith(file, 'any_id')
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})

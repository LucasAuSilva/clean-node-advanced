import { ChangeProfilePicture } from '@/data/services'
import { UploadFile } from '@/data/contracts/file-storage'
import { UUIDGenerator } from '@/data/contracts/crypto'

import { mock, MockProxy } from 'jest-mock-extended'

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

  it('should no call UploadFile when file is undefined', async () => {
    const { sut, fileStorage } = makeSut()
    await sut.perform({ id: 'any_id', file: undefined as any })
    expect(fileStorage.upload).not.toHaveBeenCalled()
  })
})

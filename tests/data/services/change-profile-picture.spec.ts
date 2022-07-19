import { ChangeProfilePicture } from '@/data/services'
import { UploadFile } from '@/data/contracts/file-storage'
import { UUIDGenerator } from '@/data/contracts/crypto'
import { SaveProfilePicture } from '@/data/contracts/repositories/profile'

import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: ChangeProfilePicture
  fileStorage: MockProxy<UploadFile>
  uniqueId: MockProxy<UUIDGenerator>
  profileRepo: MockProxy<SaveProfilePicture>
}

const makeSut = (): SutTypes => {
  const profileRepo = mock<SaveProfilePicture>()
  const uniqueId = mock<UUIDGenerator>()
  uniqueId.generate.mockReturnValue('any_unique_id')
  const fileStorage = mock<UploadFile>()
  fileStorage.upload.mockResolvedValue('any_url_image')
  const sut = new ChangeProfilePicture(fileStorage, uniqueId, profileRepo)
  return {
    sut,
    fileStorage,
    uniqueId,
    profileRepo
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
    await sut.perform({ id: 'any_id', file: undefined })
    expect(fileStorage.upload).not.toHaveBeenCalled()
  })

  it('should call SaveProfilePicture with correct values', async () => {
    const { sut, profileRepo } = makeSut()
    await sut.perform({ id: 'any_id', file })
    expect(profileRepo.savePicture).toHaveBeenCalledWith('any_url_image')
    expect(profileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveProfilePicture with correct values when file is undefined', async () => {
    const { sut, profileRepo } = makeSut()
    await sut.perform({ id: 'any_id', file: undefined })
    expect(profileRepo.savePicture).toHaveBeenCalledWith(undefined)
    expect(profileRepo.savePicture).toHaveBeenCalledTimes(1)
  })
})

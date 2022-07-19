import { Profile } from '@/domain/models/profile'
import { ChangeProfilePicture } from '@/data/services'
import { DeleteFile, UploadFile } from '@/data/contracts/file-storage'
import { UUIDGenerator } from '@/data/contracts/crypto'
import { LoadProfileById, SaveProfilePicture } from '@/data/contracts/repositories/profile'

import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/profile/user')

type SutTypes = {
  sut: ChangeProfilePicture
  fileStorage: MockProxy<UploadFile & DeleteFile>
  uniqueId: MockProxy<UUIDGenerator>
  profileRepo: MockProxy<SaveProfilePicture & LoadProfileById>
}

const makeSut = (): SutTypes => {
  const profileRepo = mock<SaveProfilePicture & LoadProfileById>()
  profileRepo.loadById.mockResolvedValue('Lucas Augusto da Silva')
  const uniqueId = mock<UUIDGenerator>()
  uniqueId.generate.mockReturnValue('any_unique_id')
  const fileStorage = mock<UploadFile & DeleteFile>()
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
  const uuid = 'any_unique_id'
  const id = 'any_id'
  const file = Buffer.from('any_buffer')

  it('should call UploadFile with correct values', async () => {
    const { sut, fileStorage } = makeSut()
    await sut.perform({ id, file })
    expect(fileStorage.upload).toHaveBeenCalledWith(file, uuid)
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('should call SaveProfilePicture with correct values', async () => {
    const { sut, profileRepo } = makeSut()
    await sut.perform({ id, file })
    const profile = jest.mocked(Profile).mock.instances[0]
    expect(profileRepo.savePicture).toHaveBeenCalledWith(profile.id, profile.pictureUrl, profile.initials)
    expect(profileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should not call LoadProfileById if file is provided', async () => {
    const { sut, profileRepo } = makeSut()
    await sut.perform({ id, file })
    expect(profileRepo.loadById).not.toHaveBeenCalled()
  })

  it('should return correct data on success', async () => {
    jest.mocked(Profile).mockImplementationOnce(_id => ({
      setPicture: jest.fn(),
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: 'any_initials'
    }))
    const { sut } = makeSut()
    const result = await sut.perform({ id, file })
    expect(result).toMatchObject({
      pictureUrl: 'any_url',
      initials: 'any_initials'
    })
  })

  it('should no call UploadFile when file is undefined', async () => {
    const { sut, fileStorage } = makeSut()
    await sut.perform({ id, file: undefined })
    expect(fileStorage.upload).not.toHaveBeenCalled()
  })

  it('should call LoadProfileById with correct values', async () => {
    const { sut, profileRepo } = makeSut()
    await sut.perform({ id, file: undefined })
    expect(profileRepo.loadById).toHaveBeenCalledWith(id)
    expect(profileRepo.loadById).toHaveBeenCalledTimes(1)
  })

  it('should call DeleteFile when file exists and SaveProfilePicture throws', async () => {
    const { sut, profileRepo, fileStorage } = makeSut()
    profileRepo.savePicture.mockRejectedValueOnce(new Error())
    const promise = sut.perform({ id, file })
    promise.catch(() => {
      expect(fileStorage.delete).toHaveBeenCalledWith({ key: uuid })
      expect(fileStorage.delete).toHaveBeenCalledTimes(1)
    })
  })
})

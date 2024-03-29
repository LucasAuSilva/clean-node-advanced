import { Profile } from '@/domain/models/profile'
import { ChangeProfilePictureService } from '@/data/services'
import { DeleteFile, UploadFile } from '@/data/contracts/file-storage'
import { UUIDGenerator } from '@/data/contracts/crypto'
import { LoadProfileById, SaveProfilePicture } from '@/data/contracts/repositories/profile'

import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/profile/user')

type SutTypes = {
  sut: ChangeProfilePictureService
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
  const sut = new ChangeProfilePictureService(fileStorage, uniqueId, profileRepo)
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
  const buffer = Buffer.from('any_buffer')
  const mimeType = 'image/png'
  const file = { buffer, mimeType }

  it('should call UploadFile with correct values', async () => {
    const { sut, fileStorage } = makeSut()
    await sut.perform({ id, file: { buffer, mimeType: 'image/png' } })
    expect(fileStorage.upload).toHaveBeenCalledWith(buffer, `${uuid}.png`)
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('should call UploadFile with correct values', async () => {
    const { sut, fileStorage } = makeSut()
    await sut.perform({ id, file: { buffer, mimeType: 'image/jpeg' } })
    expect(fileStorage.upload).toHaveBeenCalledWith(buffer, `${uuid}.jpeg`)
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('should call SaveProfilePicture with correct values', async () => {
    const { sut, profileRepo } = makeSut()
    await sut.perform({ id, file })
    const profile = jest.mocked(Profile).mock.instances[0]
    expect(profileRepo.savePicture).toHaveBeenCalledWith(profile.id, profile.pictureUrl, profile.initials)
    expect(profileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveProfilePicture with correct values', async () => {
    const { sut, profileRepo } = makeSut()
    profileRepo.savePicture.mockResolvedValueOnce(undefined)
    await sut.perform({ id, file })
    const profile = jest.mocked(Profile).mock.instances[0]
    expect(profileRepo.savePicture).toHaveBeenCalledWith(profile.id, profile.pictureUrl, profile.initials)
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
    expect.assertions(2)
    profileRepo.savePicture.mockRejectedValueOnce(new Error())
    const promise = sut.perform({ id, file })
    promise.catch(() => {
      expect(fileStorage.delete).toHaveBeenCalledWith(uuid)
      expect(fileStorage.delete).toHaveBeenCalledTimes(1)
    })
  })

  it('should not call DeleteFile when does not file exists and SaveProfilePicture throws', async () => {
    const { sut, profileRepo, fileStorage } = makeSut()
    expect.assertions(1)
    profileRepo.savePicture.mockRejectedValueOnce(new Error())
    const promise = sut.perform({ id, file: undefined })
    promise.catch(() => {
      expect(fileStorage.delete).not.toHaveBeenCalled()
    })
  })

  it('should rethrow if SaveProfilePicture throws', async () => {
    const { sut, profileRepo } = makeSut()
    const error = new Error('save_error')
    profileRepo.savePicture.mockRejectedValueOnce(error)
    const promise = sut.perform({ id, file })
    await expect(promise).rejects.toThrow(error)
  })
})

import { ChangeProfilePicture } from '@/data/services'
import { UploadFile } from '@/data/contracts/file-storage'
import { UUIDGenerator } from '@/data/contracts/crypto'
import { LoadProfileById, SaveProfilePicture } from '@/data/contracts/repositories/profile'

import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: ChangeProfilePicture
  fileStorage: MockProxy<UploadFile>
  uniqueId: MockProxy<UUIDGenerator>
  profileRepo: MockProxy<SaveProfilePicture & LoadProfileById>
}

const makeSut = (): SutTypes => {
  const profileRepo = mock<SaveProfilePicture & LoadProfileById>()
  profileRepo.loadById.mockResolvedValue('Lucas Augusto da Silva')
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
  const uuid = 'any_unique_id'
  const id = 'any_id'

  describe('When file is provided', () => {
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
      expect(profileRepo.savePicture).toHaveBeenCalledWith('any_url_image', undefined)
      expect(profileRepo.savePicture).toHaveBeenCalledTimes(1)
    })

    it('should not call LoadProfileById if file is provided', async () => {
      const { sut, profileRepo } = makeSut()
      await sut.perform({ id, file })
      expect(profileRepo.loadById).not.toHaveBeenCalled()
    })
  })

  describe('When file is not provided', () => {
    const file = undefined

    it('should no call UploadFile when file is undefined', async () => {
      const { sut, fileStorage } = makeSut()
      await sut.perform({ id, file })
      expect(fileStorage.upload).not.toHaveBeenCalled()
    })

    it('should call SaveProfilePicture with correct values when file is undefined', async () => {
      const { sut, profileRepo } = makeSut()
      await sut.perform({ id, file })
      expect(profileRepo.savePicture).toHaveBeenCalledWith(undefined, 'LS')
      expect(profileRepo.savePicture).toHaveBeenCalledTimes(1)
    })

    it('should call LoadProfileById with correct values', async () => {
      const { sut, profileRepo } = makeSut()
      await sut.perform({ id, file })
      expect(profileRepo.loadById).toHaveBeenCalledWith(id)
      expect(profileRepo.loadById).toHaveBeenCalledTimes(1)
    })
  })
})

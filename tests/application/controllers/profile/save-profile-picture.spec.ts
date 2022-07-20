import { ChangeProfilePicture } from '@/domain/features/change-profile-picture'
import { SavePictureController } from '@/application/controllers/profile'
import { Controller } from '@/application/controllers'

import { mock, MockProxy } from 'jest-mock-extended'
import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer } from '@/application/validation'

type SutTypes = {
  sut: SavePictureController
  changeProfilePicture: MockProxy<ChangeProfilePicture>
}

const makeSut = (): SutTypes => {
  const changeProfilePicture = mock<ChangeProfilePicture>()
  changeProfilePicture.perform.mockResolvedValue({ initials: 'any_initials', pictureUrl: 'any_url' })
  const sut = new SavePictureController(changeProfilePicture)
  return {
    sut,
    changeProfilePicture
  }
}

describe('SavePicture Controller', () => {
  const buffer = Buffer.from('any_buffer')
  const mimeType = 'image/png'
  const file = { buffer, mimeType }
  const userId = 'any_user_id'

  it('should extends Controller', async () => {
    const { sut } = makeSut()
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build Validators correctly', async () => {
    const { sut } = makeSut()
    const validators = sut.buildValidators({ file, userId })
    expect(validators).toEqual([
      new Required(file, 'file'),
      new RequiredBuffer(buffer, 'file'),
      new AllowedMimeTypes(['png', 'jpg'], mimeType),
      new MaxFileSize(5, buffer)
    ])
  })

  it('should call ChangeProfilePicture with correct values', async () => {
    const { sut, changeProfilePicture } = makeSut()
    await sut.handle({ file, userId })

    expect(changeProfilePicture.perform).toHaveBeenCalledWith({ id: userId, file: buffer })
    expect(changeProfilePicture.perform).toHaveBeenCalledTimes(1)
  })

  it('should return 200 with valid data', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file, userId })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { initials: 'any_initials', pictureUrl: 'any_url' }
    })
  })
})

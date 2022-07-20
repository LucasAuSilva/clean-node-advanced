import { ChangeProfilePicture } from '@/domain/features/change-profile-picture'
import { RequiredFieldError } from '@/application/errors'
import { badRequest, HttpResponse, ok } from '@/application/helpers'

import { mock, MockProxy } from 'jest-mock-extended'

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string }
type Model = Error | { initials?: string, pictureUrl?: string }

class SavePictureController {
  constructor (
    private readonly changeProfilePicture: ChangeProfilePicture
  ) {}

  async handle ({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    if (file === undefined || file === null) return badRequest(new RequiredFieldError('file'))
    if (file.buffer.length <= 0) return badRequest(new RequiredFieldError('file'))
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) return badRequest(new InvalidMimeTypeError(['png', 'jpeg']))
    if (file.buffer.length > 5 * 1024 * 1024) return badRequest(new MaxFileSizeError(5))
    const data = await this.changeProfilePicture.perform({ id: userId, file: file.buffer })
    return ok(data)
  }
}

class InvalidMimeTypeError extends Error {
  constructor (allowed: string[]) {
    super(`Unsupported type. Allowed types: ${allowed.join(', ')}`)
    this.name = 'InvalidMimeTypeError'
  }
}

class MaxFileSizeError extends Error {
  constructor (maxSizeInMb: number) {
    super(`File upload limit is ${maxSizeInMb}MB`)
    this.name = 'MaxFileSizeError'
  }
}

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

  it('should return 400 if file is undefined', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: undefined as any, userId })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('should return 400 if file is null', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: null as any, userId })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('should return 400 if file is empty', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: { buffer: Buffer.from(''), mimeType }, userId })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('should return 400 if file type is invalid', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'invalid_type' }, userId })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    })
  })

  it('should not return 400 if file type is png', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/png' }, userId })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    })
  })

  it('should not return 400 if file type is jpg', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpg' }, userId })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    })
  })

  it('should not return 400 if file type is jpeg', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpeg' }, userId })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    })
  })

  it('should return 400 if file size is bigger than 5MB', async () => {
    const { sut } = makeSut()
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
    const httpResponse = await sut.handle({ file: { buffer: invalidBuffer, mimeType }, userId })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new MaxFileSizeError(5)
    })
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

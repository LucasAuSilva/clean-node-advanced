import { RequiredFieldError } from '@/application/errors'
import { badRequest, HttpResponse } from '@/application/helpers'

type HttpRequest = { file: { buffer: Buffer } }
type Model = Error

class SavePictureController {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    return badRequest(new RequiredFieldError('file'))
  }
}

type SutTypes = {
  sut: SavePictureController
}

const makeSut = (): SutTypes => {
  const sut = new SavePictureController()
  return {
    sut
  }
}

describe('SavePicture Controller', () => {
  it('should return 400 if file is undefined', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('should return 400 if file is null', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: null as any })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('should return 400 if file is empty', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: { buffer: Buffer.from('') } })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })
})

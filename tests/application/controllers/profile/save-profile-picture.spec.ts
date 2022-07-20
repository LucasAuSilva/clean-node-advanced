import { RequiredFieldError } from '@/application/errors'
import { badRequest, HttpResponse } from '@/application/helpers'

type HttpRequest = { file: any }
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
  it('should return 400 if file is not provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('should return 400 if file is not provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ file: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })
})

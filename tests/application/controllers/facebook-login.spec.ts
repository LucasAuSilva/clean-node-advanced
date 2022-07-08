import { AuthenticationError } from '@/domain/errors'
import { FacebookAuth } from '@/domain/features/facebook-authentication'

import { mock, MockProxy } from 'jest-mock-extended'

class FacebookLoginController {
  constructor (
    private readonly facebookAuth: FacebookAuth
  ) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
      return {
        statusCode: 400,
        data: new Error('The field token is required')
      }
    }
    const result = await this.facebookAuth.perform({ token: httpRequest.token })
    return {
      statusCode: 401,
      data: result
    }
  }
}

type HttpResponse = {
  statusCode: number
  data: any
}

type SutTypes = {
  sut: FacebookLoginController
  facebookAuth: MockProxy<FacebookAuth>
}

const makeSut = (): SutTypes => {
  const facebookAuth = mock<FacebookAuth>()
  const sut = new FacebookLoginController(facebookAuth)
  return {
    sut,
    facebookAuth
  }
}

describe('FacebookLogin Controller', () => {
  it('should return 400 if token is empty', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ token: '' })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('should return 400 if token is null', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ token: null })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('should return 400 if token is undefined', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ token: undefined })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('should call FacebookAuth with correct values', async () => {
    const { sut, facebookAuth } = makeSut()
    await sut.handle({ token: 'any_token' })
    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if authentication fails', async () => {
    const { sut, facebookAuth } = makeSut()
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token: 'any_token' })
    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new AuthenticationError()
    })
  })
})

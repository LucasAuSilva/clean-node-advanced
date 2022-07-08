import { FacebookAuth } from '@/domain/features/facebook-authentication'

import { mock } from 'jest-mock-extended'

class FacebookLoginController {
  constructor (
    private readonly facebookAuth: FacebookAuth
  ) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    await this.facebookAuth.perform({ token: httpRequest.token })
    return {
      statusCode: 400,
      data: new Error('The field token is required')
    }
  }
}

type HttpResponse = {
  statusCode: number
  data: any
}

describe('FacebookLogin Controller', () => {
  it('should return 400 if token is empty', async () => {
    const facebookAuth = mock<FacebookAuth>()
    const sut = new FacebookLoginController(facebookAuth)
    const httpResponse = await sut.handle({ token: '' })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('should return 400 if token is null', async () => {
    const facebookAuth = mock<FacebookAuth>()
    const sut = new FacebookLoginController(facebookAuth)
    const httpResponse = await sut.handle({ token: null })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('should return 400 if token is undefined', async () => {
    const facebookAuth = mock<FacebookAuth>()
    const sut = new FacebookLoginController(facebookAuth)
    const httpResponse = await sut.handle({ token: undefined })
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('should call FacebookAuth with correct values', async () => {
    const facebookAuth = mock<FacebookAuth>()
    const sut = new FacebookLoginController(facebookAuth)
    await sut.handle({ token: 'any_token' })
    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  })
})

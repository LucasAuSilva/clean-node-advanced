import { AuthenticationError } from '@/domain/errors'
import { FacebookAuth } from '@/domain/features/facebook-authentication'
import { FacebookLoginController } from '@/application/controllers'
import { RequiredStringValidator } from '@/application/validation'
import { UnauthorizedError } from '@/application/errors'

import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: FacebookLoginController
  facebookAuth: MockProxy<FacebookAuth>
}

const makeSut = (): SutTypes => {
  const facebookAuth = mock<FacebookAuth>()
  facebookAuth.perform.mockResolvedValue({ accessToken: 'any_value' })
  const sut = new FacebookLoginController(facebookAuth)
  return {
    sut,
    facebookAuth
  }
}

describe('FacebookLogin Controller', () => {
  const token = { token: 'any_token' }

  it('should build Validators correctly', async () => {
    const { sut } = makeSut()
    const validators = sut.buildValidators(token)
    expect(validators).toEqual([
      new RequiredStringValidator('any_token', 'token')
    ])
  })

  it('should call FacebookAuth with correct values', async () => {
    const { sut, facebookAuth } = makeSut()
    await sut.handle({ token: 'any_token' })
    expect(facebookAuth.perform).toHaveBeenCalledWith(token)
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if authentication fails', async () => {
    const { sut, facebookAuth } = makeSut()
    facebookAuth.perform.mockRejectedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle(token)
    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('should return 200 if authentication succeeds', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(token)
    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })
})

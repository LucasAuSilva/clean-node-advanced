import { AuthenticationError } from '@/domain/errors'
import { FacebookAuth } from '@/domain/features/facebook-authentication'
import { AccessToken } from '@/domain/models/authentication'
import { FacebookLoginController } from '@/application/controllers'
import { RequiredStringValidator, ValidationComposite } from '@/application/validation'
import { ServerError, UnauthorizedError } from '@/application/errors'

import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/application/validation/composite')

type SutTypes = {
  sut: FacebookLoginController
  facebookAuth: MockProxy<FacebookAuth>
}

const makeSut = (): SutTypes => {
  const facebookAuth = mock<FacebookAuth>()
  facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'))
  const sut = new FacebookLoginController(facebookAuth)
  return {
    sut,
    facebookAuth
  }
}

describe('FacebookLogin Controller', () => {
  const token = { token: 'any_token' }

  it('should return 400 if validation fails', async () => {
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValue(error)
    }))
    jest.mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)
    const { sut } = makeSut()
    const httpResponse = await sut.handle(token)
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredStringValidator('any_token', 'token')
    ])
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    })
  })

  it('should call FacebookAuth with correct values', async () => {
    const { sut, facebookAuth } = makeSut()
    await sut.handle({ token: 'any_token' })
    expect(facebookAuth.perform).toHaveBeenCalledWith(token)
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if authentication fails', async () => {
    const { sut, facebookAuth } = makeSut()
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError())
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

  it('should return 500 if authentication throws', async () => {
    const error = new Error('infra_error')
    const { sut, facebookAuth } = makeSut()
    facebookAuth.perform.mockRejectedValueOnce(error)
    const httpResponse = await sut.handle(token)
    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})

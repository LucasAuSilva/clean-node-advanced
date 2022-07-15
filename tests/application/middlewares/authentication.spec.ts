import { Authorize } from '@/domain/features'
import { AuthenticationMiddleware } from '@/application/middlewares'
import { ForbiddenError } from '@/application/errors'

import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: AuthenticationMiddleware
  authorize: MockProxy<Authorize>
}

const makeSut = (): SutTypes => {
  const authorize = mock<Authorize>()
  authorize.auth.mockResolvedValue('any_user_id')
  const sut = new AuthenticationMiddleware(authorize)
  return {
    sut,
    authorize
  }
}

describe('Authentication Middleware', () => {
  const authorization = 'any_authorization_token'

  it('should return 403 if authorization is empty', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ authorization: '' })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('should return 403 if authorization is null', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({ authorization: null as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('should return 403 if authorization is undefined', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({ authorization: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('should call authorize with correct values', async () => {
    const { sut, authorize } = makeSut()

    await sut.handle({ authorization })

    expect(authorize.auth).toHaveBeenCalledWith({ token: authorization })
    expect(authorize.auth).toHaveBeenCalledTimes(1)
  })

  it('should return 403 if authorize throws', async () => {
    const { sut, authorize } = makeSut()
    authorize.auth.mockRejectedValueOnce(new Error('any_error'))

    const httpResponse = await sut.handle({ authorization })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('should return 200 with userId on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({ authorization })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { userId: 'any_user_id' }
    })
  })
})

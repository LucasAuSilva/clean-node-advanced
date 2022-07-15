import { Authorize } from '@/domain/features'
import { ForbiddenError } from '@/application/errors'
import { HttpResponse, forbidden } from '@/application/helpers'
import { RequiredStringValidator } from '@/application/validation'

import { mock, MockProxy } from 'jest-mock-extended'

type HttpRequest = { authorization: string }

class AuthenticationMiddleware {
  constructor (
    private readonly authorize: Authorize
  ) {}

  async handle ({ authorization }: HttpRequest): Promise<HttpResponse<Error> | undefined> {
    const error = new RequiredStringValidator(authorization, 'authorization').validate()
    if (error !== undefined) return forbidden()
    await this.authorize.auth({ token: authorization })
  }
}

type SutTypes = {
  sut: AuthenticationMiddleware
  authorize: MockProxy<Authorize>
}

const makeSut = (): SutTypes => {
  const authorize = mock<Authorize>()
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
})

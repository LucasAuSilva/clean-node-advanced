import { HttpResponse } from '@/application/helpers'

import { Request, Response, NextFunction, RequestHandler } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock, MockProxy } from 'jest-mock-extended'

type Adapter = (middleware: Middleware) => RequestHandler

const adaptExpressMiddleware: Adapter = (middleware) => async (req, res, next) => {
  await middleware.handle({ ...req.headers })
}

interface Middleware {
  handle: (httpRequest: any) => Promise<HttpResponse>
}

type SutTypes = {
  sut: RequestHandler
  middleware: MockProxy<Middleware>
}

const makeSut = (): SutTypes => {
  const middleware = mock<Middleware>()
  const sut = adaptExpressMiddleware(middleware)
  return {
    sut,
    middleware
  }
}

describe('Express Middleware', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeAll(() => {
    req = getMockReq({ headers: { any: 'any' } })
    res = getMockRes().res
    next = getMockRes().next
  })

  it('should call handle with correct request', async () => {
    const { sut, middleware } = makeSut()
    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty request', async () => {
    const { sut, middleware } = makeSut()
    req = getMockReq()
    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({})
  })
})

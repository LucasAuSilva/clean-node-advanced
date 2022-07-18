import { Middleware } from '@/application/middlewares'
import { adaptExpressMiddleware } from '@/main/adapters/express-middleware'

import { Request, Response, NextFunction, RequestHandler } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: RequestHandler
  middleware: MockProxy<Middleware>
}

const makeSut = (): SutTypes => {
  const middleware = mock<Middleware>()
  middleware.handle.mockResolvedValue({
    statusCode: 200,
    data: {
      emptyProp: '',
      nullProp: null,
      undefinedProp: undefined,
      prop: 'any_value'
    }
  })
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

  beforeEach(() => {
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

  it('should respond with correct error and statusCode', async () => {
    const { sut, middleware } = makeSut()
    middleware.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: new Error('any_error')
    })
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('should add valid data to req.locals', async () => {
    const { sut } = makeSut()
    await sut(req, res, next)

    expect(req.locals).toEqual({ prop: 'any_value' })
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('should not call res if middleware succeeds', async () => {
    const { sut } = makeSut()
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledTimes(0)
    expect(res.json).toHaveBeenCalledTimes(0)
  })
})

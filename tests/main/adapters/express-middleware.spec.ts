import { HttpResponse } from '@/application/helpers'

import { RequestHandler } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock } from 'jest-mock-extended'

type Adapter = (middleware: Middleware) => RequestHandler

const adaptExpressMiddleware: Adapter = (middleware) => async (req, res, next) => {
  await middleware.handle({ ...req.headers })
}

interface Middleware {
  handle: (httpRequest: any) => Promise<HttpResponse>
}

describe('Express Middleware', () => {
  it('should call handle with correct request', async () => {
    const req = getMockReq({ headers: { any: 'any' } })
    const res = getMockRes().res
    const next = getMockRes().next
    const middleware = mock<Middleware>()
    const sut = adaptExpressMiddleware(middleware)

    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })
})

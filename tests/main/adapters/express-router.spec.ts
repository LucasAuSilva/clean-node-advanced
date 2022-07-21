import { Controller } from '@/application/controllers'
import { adaptExpressRoute } from '@/main/adapters'

import { NextFunction, Request, RequestHandler, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: RequestHandler
  controller: MockProxy<Controller>
}

const makeSut = (): SutTypes => {
  const controller = mock<Controller>()
  controller.handle.mockResolvedValue({
    statusCode: 200,
    data: {
      valid: 'valid_data'
    }
  })
  const sut = adaptExpressRoute(controller)
  return {
    sut,
    controller
  }
}

describe('Express Router', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    req = getMockReq({ body: { anyBody: 'any_body' }, locals: { anyLocals: 'any_locals' } })
    res = getMockRes().res
    next = getMockRes().next
  })

  it('should call handle with correct request', async () => {
    const { sut, controller } = makeSut()

    await sut(req, res, next)

    expect(controller.handle).toHaveBeenCalledWith({ anyBody: 'any_body', anyLocals: 'any_locals' })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty request', async () => {
    const { sut, controller } = makeSut()
    req = getMockReq()

    await sut(req, res, next)

    expect(controller.handle).toHaveBeenCalledWith({})
  })

  it('should respond with 200 and valid data', async () => {
    const { sut } = makeSut()

    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ valid: 'valid_data' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('should respond with 204 and empty data', async () => {
    const { sut, controller } = makeSut()
    controller.handle.mockResolvedValue({
      statusCode: 204,
      data: {}
    })

    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(204)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({})
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('should respond with 400 and valid error', async () => {
    const { sut, controller } = makeSut()
    controller.handle.mockResolvedValueOnce({
      statusCode: 400,
      data: new Error('any_error')
    })
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('should respond with 500 and valid error', async () => {
    const { sut, controller } = makeSut()
    controller.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: new Error('any_error')
    })
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})

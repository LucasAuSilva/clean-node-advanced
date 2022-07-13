import { Controller } from '@/application/controllers'

import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock, MockProxy } from 'jest-mock-extended'

class ExpressRouter {
  constructor (
    private readonly controller: Controller
  ) {}

  async adapt (req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controller.handle({ ...req.body })
    if (httpResponse.statusCode === 200) {
      res.status(200).json(httpResponse.data)
    } else {
      res.status(400).json({ error: httpResponse.data.message })
    }
  }
}

type SutTypes = {
  sut: ExpressRouter
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
  const sut = new ExpressRouter(controller)
  return {
    sut,
    controller
  }
}

describe('Express Router', () => {
  let req: Request
  let res: Response

  beforeEach(() => {
    req = getMockReq({ body: { any: 'any' } })
    res = getMockRes().res
  })

  it('should call handle with correct request', async () => {
    const { sut, controller } = makeSut()

    await sut.adapt(req, res)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty request', async () => {
    const { sut, controller } = makeSut()
    req = getMockReq()

    await sut.adapt(req, res)

    expect(controller.handle).toHaveBeenCalledWith({})
  })

  it('should respond with 200 and valid data', async () => {
    const { sut } = makeSut()

    await sut.adapt(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ valid: 'valid_data' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('should respond with 400 and valid error', async () => {
    const { sut, controller } = makeSut()
    controller.handle.mockResolvedValueOnce({
      statusCode: 400,
      data: new Error('any_error')
    })
    await sut.adapt(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})

import { Controller } from '@/application/controllers'

import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock } from 'jest-mock-extended'

class ExpressRouter {
  constructor (
    private readonly controller: Controller
  ) {}

  async adapt (req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controller.handle({ ...req.body })
    res.status(200).json(httpResponse.data)
  }
}

type SutTypes = {
  sut: ExpressRouter
  controller: Controller
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
})

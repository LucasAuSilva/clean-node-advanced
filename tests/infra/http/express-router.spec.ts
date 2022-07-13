import { Controller } from '@/application/controllers'

import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock } from 'jest-mock-extended'

class ExpressRouter {
  constructor (
    private readonly controller: Controller
  ) {}

  async adapt (req: Request, _res: Response): Promise<void> {
    await this.controller.handle({ ...req.body })
  }
}

type SutTypes = {
  sut: ExpressRouter
  controller: Controller
}

const makeSut = (): SutTypes => {
  const controller = mock<Controller>()
  const sut = new ExpressRouter(controller)
  return {
    sut,
    controller
  }
}

describe('Express Router', () => {
  let req = getMockReq({ body: { any: 'any' } })
  const res = getMockRes().res

  it('should call handle with correct request', async () => {
    const { sut, controller } = makeSut()

    await sut.adapt(req, res)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
  })

  it('should call handle with empty request', async () => {
    const { sut, controller } = makeSut()
    req = getMockReq()

    await sut.adapt(req, res)

    expect(controller.handle).toHaveBeenCalledWith({})
  })
})

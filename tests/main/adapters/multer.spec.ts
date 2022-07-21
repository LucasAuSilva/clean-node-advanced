import { Request, Response, NextFunction, RequestHandler } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import multer from 'multer'

jest.mock('multer')

const adaptMulter: RequestHandler = (req, res, next) => {
  const upload = multer().single('file')
  upload(req, res, () => {})
}

describe('Multer Adapter', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    req = getMockReq({ body: { anyBody: 'any_body' }, locals: { anyLocals: 'any_locals' } })
    res = getMockRes().res
    next = getMockRes().next
  })

  it('should call single upload with correct values', async () => {
    const uploadSpy = jest.fn()
    const singleSpy = jest.fn().mockImplementation(() => uploadSpy)
    const multerSpy = jest.fn().mockImplementation(() => ({ single: singleSpy }))
    const fakeMulter = multer as jest.Mocked<typeof multer>
    jest.mocked(fakeMulter).mockImplementation(multerSpy)
    const sut = adaptMulter

    await sut(req, res, next)

    expect(multerSpy).toHaveBeenCalledWith()
    expect(multerSpy).toHaveBeenCalledTimes(1)
    expect(singleSpy).toHaveBeenCalledWith('file')
    expect(singleSpy).toHaveBeenCalledTimes(1)
    expect(uploadSpy).toHaveBeenCalledWith(req, res, expect.any(Function))
    expect(uploadSpy).toHaveBeenCalledTimes(1)
  })
})

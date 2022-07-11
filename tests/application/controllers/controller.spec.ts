import { Controller } from '@/application/controllers'
import { ValidationComposite } from '@/application/validation'
import { ServerError } from '@/application/errors'
import { HttpResponse } from '../helpers'

jest.mock('@/application/validation/composite')

class ControllerStub extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    data: 'any_data'
  }

  async perform (_httpRequest: any): Promise<HttpResponse> {
    return this.result
  }
}

type SutTypes = {
  sut: ControllerStub
}

const makeSut = (): SutTypes => {
  return { sut: new ControllerStub() }
}

describe('Controller', () => {
  it('should return 400 if validation fails', async () => {
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValue(error)
    }))
    jest.mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)
    const { sut } = makeSut()
    const httpResponse = await sut.handle('any_value')
    expect(ValidationComposite).toHaveBeenCalledWith([])
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    })
  })

  it('should return 500 if perform throws', async () => {
    const error = new Error('perform_error')
    const { sut } = makeSut()
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error)
    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })

  it('should return same result as perform', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle('any_value')
    expect(httpResponse).toEqual(sut.result)
  })
})

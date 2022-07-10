import { Validator } from '@/application/contracts'

import { mock, MockProxy } from 'jest-mock-extended'

class ValidationComposite implements Validator {
  constructor (
    private readonly validators: Validator[]
  ) {}

  validate (): Error | undefined {
    for (const validator of this.validators) {
      const error = validator.validate()
      if (error !== undefined) {
        return error
      }
    }
  }
}

type SutTypes = {
  sut: ValidationComposite
  validators: Validator[]
  firstValidator: MockProxy<Validator>
  secondValidator: MockProxy<Validator>
}

const makeSut = (): SutTypes => {
  const firstValidator = mock<Validator>()
  firstValidator.validate.mockReturnValue(undefined)
  const secondValidator = mock<Validator>()
  secondValidator.validate.mockReturnValue(undefined)
  const validators = [firstValidator, secondValidator]
  const sut = new ValidationComposite(validators)
  return {
    sut,
    validators,
    firstValidator,
    secondValidator
  }
}

describe('Validation Composite', () => {
  it('should return undefined if all Validators returns undefined', () => {
    const { sut } = makeSut()

    const error = sut.validate()

    expect(error).toBe(undefined)
  })

  it('should return the first error', () => {
    const { sut, firstValidator, secondValidator } = makeSut()
    firstValidator.validate.mockReturnValueOnce(new Error('error_1'))
    secondValidator.validate.mockReturnValueOnce(new Error('error_2'))

    const error = sut.validate()

    expect(error).toEqual(new Error('error_1'))
  })
})

import { Validator } from '@/application/contracts'

import { mock } from 'jest-mock-extended'

class ValidationComposite {
  constructor (
    private readonly validators: Validator[]
  ) {}

  validate (): undefined {
    return undefined
  }
}

type SutTypes = {
  sut: ValidationComposite
  validators: Validator[]
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
    validators
  }
}

describe('Validation Composite', () => {
  it('should return undefined if all Validators returns undefined', () => {
    const { sut } = makeSut()

    const error = sut.validate()

    expect(error).toBe(undefined)
  })
})

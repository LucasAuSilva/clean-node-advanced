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

describe('Validation Composite', () => {
  it('should return undefined if all Validators returns undefined', () => {
    const firstValidator = mock<Validator>()
    firstValidator.validate.mockReturnValue(undefined)
    const secondValidator = mock<Validator>()
    secondValidator.validate.mockReturnValue(undefined)
    const validators = [firstValidator, secondValidator]
    const sut = new ValidationComposite(validators)

    const error = sut.validate()

    expect(error).toBe(undefined)
  })
})

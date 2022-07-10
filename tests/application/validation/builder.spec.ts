import { Validator } from '@/application/contracts'
import { RequiredStringValidator } from '@/application/validation'

class ValidationBuilder {
  private constructor (
    private readonly value: string,
    private readonly fieldName: string,
    private readonly _validators: Validator[] = []
  ) {}

  static of (dto: {value: string, fieldName: string}): ValidationBuilder {
    return new ValidationBuilder(dto.value, dto.fieldName)
  }

  required (): ValidationBuilder {
    this._validators.push(new RequiredStringValidator(this.value, this.fieldName))
    return this
  }

  build (): Validator[] {
    return this._validators
  }
}

describe('Validation Builder', () => {
  it('should return a RequiredStringValidator', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value', fieldName: 'any_name' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredStringValidator('any_value', 'any_name')])
  })
})

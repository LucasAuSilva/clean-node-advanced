import { RequiredFieldError } from '@/application/errors'

class RequiredStringValidator {
  constructor (
    private readonly value: string,
    private readonly fieldName: string
  ) {}

  validate (): Error | undefined {
    if (this.value === '' || this.value === null || this.value === undefined) {
      return new RequiredFieldError(this.fieldName)
    }
  }
}

describe('RequiredString Validator', () => {
  it('should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredStringValidator('', 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('should return RequiredFieldError if value is null', () => {
    const sut = new RequiredStringValidator(null as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('should return RequiredFieldError if value is undefined', () => {
    const sut = new RequiredStringValidator(undefined as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('should return undefined if value is not empty', () => {
    const sut = new RequiredStringValidator('any_value', 'any_field')

    const error = sut.validate()

    expect(error).toBe(undefined)
  })
})

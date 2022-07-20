import { Validator } from '@/application/contracts'
import { RequiredString } from '@/application/validation'

export class ValidationBuilder {
  private constructor (
    private readonly value: string,
    private readonly fieldName: string,
    private readonly _validators: Validator[] = []
  ) {}

  static of (dto: {value: string, fieldName: string}): ValidationBuilder {
    return new ValidationBuilder(dto.value, dto.fieldName)
  }

  required (): ValidationBuilder {
    this._validators.push(new RequiredString(this.value, this.fieldName))
    return this
  }

  build (): Validator[] {
    return this._validators
  }
}

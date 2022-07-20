import { RequiredFieldError } from '@/application/errors'
import { Required } from '@/application/validation'

export class RequiredBuffer extends Required {
  constructor (
    override readonly value: Buffer,
    override readonly fieldName?: string
  ) { super(value, fieldName) }

  validate (): Error | undefined {
    if (super.validate() !== undefined || this.value.length === 0) {
      return new RequiredFieldError(this.fieldName)
    }
  }
}

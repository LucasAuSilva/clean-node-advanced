import { RequiredFieldError } from '@/application/errors'
import { Validation } from '@/application/contracts'

export class RequiredStringValidator implements Validation {
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

import { Validator } from '@/application/contracts'
import { AllowedMimeTypes, ExtensionsImages, MaxFileSize, Required, RequiredBuffer, RequiredString } from '@/application/validation'

export class ValidationBuilder {
  private constructor (
    private readonly value: any,
    private readonly fieldName?: string,
    private readonly _validators: Validator[] = []
  ) {}

  static of (dto: {value: any, fieldName?: string}): ValidationBuilder {
    return new ValidationBuilder(dto.value, dto.fieldName)
  }

  required (): ValidationBuilder {
    if (this.value instanceof Buffer) {
      this._validators.push(new RequiredBuffer(this.value, this.fieldName))
    } else if (typeof this.value === 'string') {
      this._validators.push(new RequiredString(this.value, this.fieldName))
    } else if (typeof this.value === 'object') {
      this._validators.push(new Required(this.value, this.fieldName))
      if (this.value.buffer !== undefined) {
        this._validators.push(new RequiredBuffer(this.value.buffer, this.fieldName))
      }
    }
    return this
  }

  image ({ allowed, maxSizeInMb }: { allowed: ExtensionsImages[], maxSizeInMb: number }): ValidationBuilder {
    if (this.value.mimeType !== undefined) {
      this._validators.push(new AllowedMimeTypes(allowed, this.value.mimeType))
    }
    if (this.value.buffer !== undefined) {
      this._validators.push(new MaxFileSize(maxSizeInMb, this.value.buffer))
    }
    return this
  }

  build (): Validator[] {
    return this._validators
  }
}

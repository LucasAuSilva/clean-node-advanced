import { Validator } from '@/application/contracts'
import { MaxFileSizeError } from '@/application/errors'

export class MaxFileSize implements Validator {
  constructor (
    private readonly maxSizeInMb: number,
    private readonly value: Buffer
  ) {}

  validate (): Error | undefined {
    const maxFileSizeInBytes = this.maxSizeInMb * 1024 * 1024
    if (this.value.length > maxFileSizeInBytes) return new MaxFileSizeError(this.maxSizeInMb)
  }
}

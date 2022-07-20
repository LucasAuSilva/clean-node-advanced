import { Validator } from '@/application/contracts'
import { InvalidMimeTypeError } from '@/application/errors'

type Extensions = 'png' | 'jpg'

export class AllowedMimeTypes implements Validator {
  constructor (
    private readonly allowed: Extensions[],
    private readonly mimeType: string
  ) {}

  validate (): Error | undefined {
    let isValid = false
    this.allowed.forEach(allow => {
      switch (allow) {
        case 'png':
          isValid = this.isPng()
          return
        case 'jpg':
          isValid = this.isJpg()
      }
    })
    if (!isValid) return new InvalidMimeTypeError(this.allowed)
  }

  private isPng (): boolean {
    return this.allowed.includes('png') && this.mimeType === 'image/png'
  }

  private isJpg (): boolean {
    return this.allowed.includes('jpg') && /image\/jpe?g/.test(this.mimeType)
  }
}

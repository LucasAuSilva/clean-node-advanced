import { InvalidMimeTypeError } from '@/application/errors'

type Extensions = 'png' | 'jpg'

class AllowedMimeTypes {
  constructor (
    private readonly allowed: Extensions[],
    private readonly mimeType: string
  ) {}

  validate (): Error {
    return new InvalidMimeTypeError(this.allowed)
  }
}

describe('Allowed MimeTypes', () => {
  it('should return InvalidMimeTypeError if value is invalid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/jpg')

    const error = sut.validate()

    expect(error).toEqual(new InvalidMimeTypeError(['png']))
  })
})

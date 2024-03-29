import { MaxFileSize } from '@/application/validation'
import { MaxFileSizeError } from '@/application/errors'

describe('Max FileSize', () => {
  it('should return InvalidMimeTypeError if value is invalid', () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
    const sut = new MaxFileSize(5, invalidBuffer)

    const error = sut.validate()

    expect(error).toEqual(new MaxFileSizeError(5))
  })

  it('should return undefined if value is valid', () => {
    const buffer = Buffer.from(new ArrayBuffer(4 * 1024 * 1024))
    const sut = new MaxFileSize(5, buffer)

    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  it('should return undefined if value is valid at limit', () => {
    const buffer = Buffer.from(new ArrayBuffer(5 * 1024 * 1024))
    const sut = new MaxFileSize(5, buffer)

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})

import { Required, RequiredBuffer } from '@/application/validation'
import { RequiredFieldError } from '@/application/errors'

describe('RequiredBuffer Validator', () => {
  it('should extends Required', () => {
    const sut = new RequiredBuffer(Buffer.from('any_buffer'))

    expect(sut).toBeInstanceOf(Required)
  })

  it('should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredBuffer(Buffer.from(''))

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError())
  })

  it('should return undefined if value is not empty', () => {
    const sut = new RequiredBuffer(Buffer.from('any_buffer'), 'any_field')

    const error = sut.validate()

    expect(error).toBe(undefined)
  })
})

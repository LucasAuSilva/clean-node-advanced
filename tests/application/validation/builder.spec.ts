import { ValidationBuilder, RequiredString, RequiredBuffer, Required, MaxFileSize, AllowedMimeTypes } from '@/application/validation'

describe('Validation Builder', () => {
  it('should return a RequiredString', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value', fieldName: 'any_name' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredString('any_value', 'any_name')])
  })

  it('should return a RequiredBuffer', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder
      .of({ value: buffer })
      .required()
      .build()

    expect(validators).toEqual([new RequiredBuffer(buffer)])
  })

  it('should return a Required', () => {
    const validators = ValidationBuilder
      .of({ value: { any: 'any' } })
      .required()
      .build()

    expect(validators).toEqual([new Required({ any: 'any' })])
  })

  it('should return a Required', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder
      .of({ value: { buffer } })
      .required()
      .build()

    expect(validators).toEqual([
      new Required({ buffer }),
      new RequiredBuffer(buffer)
    ])
  })

  it('should return a MaxFileSize', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder
      .of({ value: { buffer } })
      .image({ allowed: ['png'], maxSizeInMb: 5 })
      .build()

    expect(validators).toEqual([new MaxFileSize(5, buffer)])
  })

  it('should return a AllowedMimeTypes', () => {
    const validators = ValidationBuilder
      .of({ value: { mimeType: 'image/png' } })
      .image({ allowed: ['png'], maxSizeInMb: 5 })
      .build()

    expect(validators).toEqual([new AllowedMimeTypes(['png'], 'image/png')])
  })

  it('should return a image validator complete', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder
      .of({ value: { buffer, mimeType: 'image/png' } })
      .image({ allowed: ['png'], maxSizeInMb: 5 })
      .build()

    expect(validators).toEqual([
      new AllowedMimeTypes(['png'], 'image/png'),
      new MaxFileSize(5, buffer)
    ])
  })
})

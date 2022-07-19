import { v4 } from 'uuid'

jest.mock('uuid')

class UUIDHandler {
  generate (key: string): string {
    return `${key}_${v4()}`
  }
}

const makeSut = (): UUIDHandler => {
  jest.mocked(v4).mockReturnValue('any_uuid')
  return new UUIDHandler()
}

describe('UUID Handler', () => {
  it('should call uuid.v4', () => {
    const sut = makeSut()
    sut.generate('any_key')
    expect(v4).toHaveBeenCalledTimes(1)
  })

  it('should return correct uuid', () => {
    const sut = makeSut()
    const uuid = sut.generate('any_key')

    expect(uuid).toBe('any_key_any_uuid')
  })
})

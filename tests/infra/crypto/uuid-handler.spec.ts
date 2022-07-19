import { v4 } from 'uuid'

jest.mock('uuid')

class UUIDHandler {
  generate (key: string): string {
    return `${key}_${v4()}`
  }
}

describe('UUID Handler', () => {
  it('should call uuid.v4', () => {
    const sut = new UUIDHandler()
    sut.generate('any_key')
    expect(v4).toHaveBeenCalledTimes(1)
  })

  it('should return correct uuid', () => {
    jest.mocked(v4).mockReturnValueOnce('any_uuid')
    const sut = new UUIDHandler()

    const uuid = sut.generate('any_key')

    expect(uuid).toBe('any_key_any_uuid')
  })
})

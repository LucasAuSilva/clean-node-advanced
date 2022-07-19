import { v4 } from 'uuid'

jest.mock('uuid')

class UUIDHandler {
  generate (key: string): void {
    v4()
  }
}

describe('UUID Handler', () => {
  it('should call uuid.v4', () => {
    const sut = new UUIDHandler()

    sut.generate('any_key')

    expect(v4).toHaveBeenCalledTimes(1)
  })
})

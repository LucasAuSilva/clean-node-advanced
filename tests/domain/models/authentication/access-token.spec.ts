import { AccessToken } from '@/domain/models/authentication'

describe('Access token', () => {
  it('should create with a value', () => {
    const sut = new AccessToken('any_value')

    expect(sut).toEqual({ value: 'any_value' })
  })

  it('should expire in 180_00_00 ms', () => {
    expect(AccessToken.expirationInMs).toBe(180_00_00)
  })
})

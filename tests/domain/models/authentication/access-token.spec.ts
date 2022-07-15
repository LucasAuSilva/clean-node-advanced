import { AccessToken } from '@/domain/models/authentication'

describe('Access token', () => {
  it('should expire in 180_00_00 ms', () => {
    expect(AccessToken.expirationInMs).toBe(180_00_00)
  })
})

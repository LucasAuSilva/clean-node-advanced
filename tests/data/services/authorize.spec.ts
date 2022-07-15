import { AuthorizeService } from '@/data/services/authorize'
import { TokenValidator } from '@/data/contracts/crypto'
import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/account/facebook-account')

type SutTypes = {
  sut: AuthorizeService
  crypto: MockProxy<TokenValidator>
}

const makeSut = (): SutTypes => {
  const crypto = mock<TokenValidator>()
  crypto.validateToken.mockResolvedValue('any_id')
  const sut = new AuthorizeService(crypto)
  return {
    sut,
    crypto
  }
}

describe('Authorize Service', () => {
  const token = 'any_token'

  it('should call TokenValidator with correct values', async () => {
    const { sut, crypto } = makeSut()
    await sut.auth({ token })
    expect(crypto.validateToken).toHaveBeenCalledWith(token)
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })

  it('should return the correct accessToken', async () => {
    const { sut } = makeSut()
    const userId = await sut.auth({ token })

    expect(userId).toBe('any_id')
  })
})

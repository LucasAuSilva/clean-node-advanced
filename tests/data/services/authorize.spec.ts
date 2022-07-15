import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/account/facebook-account')

class AuthorizeService {
  constructor (
    private readonly crypto: TokenValidator
  ) {}

  async auth (dto: AuthorizeDto): Promise<AuthorizeResult> {
    return this.crypto.validate(dto.token)
  }
}

type AuthorizeDto = { token: string }
type AuthorizeResult = string

interface TokenValidator {
  validate: (token: string) => Promise<string>
}

type SutTypes = {
  sut: AuthorizeService
  crypto: MockProxy<TokenValidator>
}

const makeSut = (): SutTypes => {
  const crypto = mock<TokenValidator>()
  crypto.validate.mockResolvedValue('any_id')
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
    expect(crypto.validate).toHaveBeenCalledWith(token)
    expect(crypto.validate).toHaveBeenCalledTimes(1)
  })

  it('should return the correct accessToken', async () => {
    const { sut } = makeSut()
    const userId = await sut.auth({ token })

    expect(userId).toBe('any_id')
  })
})

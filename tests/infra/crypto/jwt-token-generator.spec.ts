import { TokenGeneratorDto, TokenGeneratorResult } from '@/data/contracts/crypto'

import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

class JwtTokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken (dto: TokenGeneratorDto): Promise<TokenGeneratorResult> {
    const expirationInSeconds = dto.expirationInMs / 1000
    return jwt.sign({ key: dto.key }, this.secret, { expiresIn: expirationInSeconds })
  }
}

type SutTypes = {
  sut: JwtTokenGenerator
  fakeJwt: jest.Mocked<typeof jwt>
}

const makeSut = (): SutTypes => {
  const fakeJwt = jwt as jest.Mocked<typeof jwt>
  fakeJwt.sign.mockImplementation(() => 'any_token')
  const sut = new JwtTokenGenerator('any_secret')
  return {
    sut,
    fakeJwt
  }
}

describe('JwtToken Generator', () => {
  it('should call sign with correct values', async () => {
    const { sut, fakeJwt } = makeSut()
    await sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000
    })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1 })
    expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
  })

  it('should return a token', async () => {
    const { sut } = makeSut()
    const token = await sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000
    })

    expect(token).toBe('any_token')
  })
})

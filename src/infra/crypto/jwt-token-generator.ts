import { TokenGenerator, TokenGeneratorDto, TokenGeneratorResult } from '@/data/contracts/crypto'

import { sign } from 'jsonwebtoken'

type TokenDto = TokenGeneratorDto
type TokenResult = TokenGeneratorResult

export class JwtTokenGenerator implements TokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken ({ key, expirationInMs }: TokenDto): Promise<TokenResult> {
    const expirationInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }
}

import { TokenGenerator, TokenGeneratorDto } from '@/data/contracts/crypto'

import { sign, verify } from 'jsonwebtoken'

type TokenDto = TokenGeneratorDto

export class JwtTokenHandler implements TokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken ({ key, expirationInMs }: TokenDto): Promise<string> {
    const expirationInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }

  async validateToken (token: string): Promise<void> {
    verify(token, this.secret)
  }
}

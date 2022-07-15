import { TokenGenerator, TokenGeneratorDto, TokenValidator } from '@/data/contracts/crypto'

import { JwtPayload, sign, verify } from 'jsonwebtoken'

type TokenDto = TokenGeneratorDto

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken ({ key, expirationInMs }: TokenDto): Promise<string> {
    const expirationInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }

  async validateToken (token: string): Promise<string> {
    const payload = verify(token, this.secret) as JwtPayload
    return payload.key
  }
}

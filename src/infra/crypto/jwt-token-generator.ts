import { TokenGeneratorDto, TokenGeneratorResult } from '@/data/contracts/crypto'

import { sign } from 'jsonwebtoken'

export class JwtTokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken (dto: TokenGeneratorDto): Promise<TokenGeneratorResult> {
    const expirationInSeconds = dto.expirationInMs / 1000
    return sign({ key: dto.key }, this.secret, { expiresIn: expirationInSeconds })
  }
}

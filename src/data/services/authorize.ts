import { Authorize, AuthorizeDto, AuthorizeResult } from '@/domain/features'
import { TokenValidator } from '@/data/contracts/crypto'

export class AuthorizeService implements Authorize {
  constructor (
    private readonly crypto: TokenValidator
  ) {}

  async auth (dto: AuthorizeDto): Promise<AuthorizeResult> {
    return this.crypto.validateToken(dto.token)
  }
}

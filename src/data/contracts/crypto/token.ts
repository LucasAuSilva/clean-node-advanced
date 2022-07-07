export interface TokenGenerator {
  generateToken: (dto: TokenGeneratorDto) => Promise<TokenGeneratorResult>
}

export type TokenGeneratorDto = {
  key: string
  expirationInMs: number
}

export type TokenGeneratorResult = string

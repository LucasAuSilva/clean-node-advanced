export interface TokenGenerator {
  generateToken: (dto: TokenGeneratorDto) => Promise<string>
}

export type TokenGeneratorDto = {
  key: string
  expirationInMs: number
}

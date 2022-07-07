export interface TokenGenerator {
  generateToken: (dto: TokenGeneratorDto) => Promise<void>
}

export type TokenGeneratorDto = {
  key: string
}

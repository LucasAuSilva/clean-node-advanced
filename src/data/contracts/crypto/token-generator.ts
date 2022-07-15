export interface TokenGenerator {
  generateToken: (key: string, expirationInMs: number) => Promise<string>
}

export type TokenGeneratorDto = {
  key: string
  expirationInMs: number
}

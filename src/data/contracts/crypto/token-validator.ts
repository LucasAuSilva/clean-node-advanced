export interface TokenValidator {
  validateToken: (token: string) => Promise<string>
}

export interface TokenValidator {
  validate: (token: string) => Promise<string>
}

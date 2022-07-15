export interface Authorize {
  auth: (dto: AuthorizeDto) => Promise<AuthorizeResult>
}

export type AuthorizeDto = { token: string }
export type AuthorizeResult = string

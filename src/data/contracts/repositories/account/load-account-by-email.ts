export interface LoadAccountByEmail {
  loadByEmail: (dto: LoadAccountByEmailDto) => Promise<LoadAccountByEmailResult>
}

export type LoadAccountByEmailDto = {
  email: string
}

export type LoadAccountByEmailResult = undefined | {
  id: string
  name?: string
}

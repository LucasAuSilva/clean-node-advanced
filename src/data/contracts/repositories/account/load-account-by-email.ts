export interface LoadAccountByEmailRepository {
  loadByEmail: (dto: LoadAccountByEmailRepositoryDto) => Promise<LoadAccountByEmailRepositoryResult>
}

export type LoadAccountByEmailRepositoryDto = {
  email: string
}

export type LoadAccountByEmailRepositoryResult = undefined | {
  id: string
  name?: string
}

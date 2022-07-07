export interface LoadAccountByEmailRepository {
  loadByEmail: (dto: LoadAccountByEmailRepositoryDto) => Promise<LoadAccountByEmailRepositoryResult>
}

type LoadAccountByEmailRepositoryDto = {
  email: string
}

type LoadAccountByEmailRepositoryResult = undefined

export interface LoadAccountByEmailRepository {
  loadByEmail: (dto: LoadAccountByEmailRepositoryDto) => Promise<void>
}

type LoadAccountByEmailRepositoryDto = {
  email: string
}

export interface CreateFacebookAccountRepository {
  createFromFacebook: (dto: CreateFacebookAccountRepositoryDto) => Promise<void>
}

export type CreateFacebookAccountRepositoryDto = {
  email: string
  name: string
  facebookId: string
}

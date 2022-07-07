export interface UpdateFacebookAccountRepository {
  updateWithFacebook: (dto: UpdateFacebookAccountRepositoryDto) => Promise<void>
}

export type UpdateFacebookAccountRepositoryDto = {
  id: string
  name: string
  facebookId: string
}

export interface SaveFacebookAccountRepository {
  saveWithFacebook: (dto: SaveFacebookAccountRepositoryDto) => Promise<void>
}

export type SaveFacebookAccountRepositoryDto = {
  id?: string
  email: string
  name: string
  facebookId: string
}

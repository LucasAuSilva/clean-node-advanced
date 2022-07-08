export interface SaveFacebookAccountRepository {
  saveWithFacebook: (dto: SaveFacebookAccountRepositoryDto) => Promise<SaveFacebookAccountRepositoryResult>
}

export type SaveFacebookAccountRepositoryDto = {
  id?: string
  email: string
  name: string
  facebookId: string
}

export type SaveFacebookAccountRepositoryResult = {
  id: string
}

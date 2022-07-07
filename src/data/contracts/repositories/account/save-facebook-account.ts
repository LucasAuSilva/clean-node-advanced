export interface SaveFacebookAccountRepository {
  saveWithFacebook: (dto: SaveFacebookAccountRepositoryDto) => Promise<SaveFacebookAccountRepositoryResult>
}

export type SaveFacebookAccountRepositoryDto = {
  id?: string
  email: string
  name: string
  facebookId: string
}

type SaveFacebookAccountRepositoryResult = {
  id: string
}

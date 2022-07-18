export interface SaveFacebookAccount {
  saveWithFacebook: (dto: SaveFacebookAccountDto) => Promise<SaveFacebookAccountResult>
}

export type SaveFacebookAccountDto = {
  id?: string
  email: string
  name: string
  facebookId: string
}

export type SaveFacebookAccountResult = {
  id: string
}

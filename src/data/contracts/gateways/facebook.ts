export interface LoadFacebookUser {
  loadUser: (dto: LoadFacebookUserDto) => Promise<LoadFacebookUserResult>
}

export type LoadFacebookUserResult = undefined | {
  facebookId: string
  name: string
  email: string
}

export type LoadFacebookUserDto = {
  token: string
}

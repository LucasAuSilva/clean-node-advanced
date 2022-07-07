export interface LoadFacebookUserApi {
  loadUser: (dto: LoadFacebookUserApiDto) => Promise<LoadFacebookUserApiResult>
}

export type LoadFacebookUserApiResult = undefined | {
  facebookId: string
  name: string
  email: string
}

export type LoadFacebookUserApiDto = {
  token: string
}

export interface LoadFacebookUserApi {
  loadUser: (token: string) => Promise<LoadFacebookUserApiReturn>
}

export type LoadFacebookUserApiReturn = undefined

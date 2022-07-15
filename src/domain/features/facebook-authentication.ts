export interface FacebookAuth {
  perform: (dto: FacebookAuthDto) => Promise<FacebookAuthResult>
}

export type FacebookAuthDto = {
  token: string
}

export type FacebookAuthResult = { accessToken: string }

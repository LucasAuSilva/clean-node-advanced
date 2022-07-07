import { AccessToken } from '@/domain/models/authentication/access-token'
import { AuthenticationError } from '@/domain/errors'

export interface FacebookAuth {
  perform: (dto: FacebookAuthDto) => Promise<FacebookAuthResult>
}

export type FacebookAuthDto = {
  token: string
}

export type FacebookAuthResult = AccessToken | AuthenticationError

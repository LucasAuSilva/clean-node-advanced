import { AccessToken } from '@/domain/models/access-token'
import { AuthenticationError } from '@/domain/errors'

export interface FacebookAuthentication {
  perform: (dto: FacebookAuthenticationDto) => Promise<FacebookAuthenticationResult>
}

export type FacebookAuthenticationDto = {
  token: string
}

export type FacebookAuthenticationResult = AccessToken | AuthenticationError

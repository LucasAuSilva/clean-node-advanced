import { AccessToken } from '@/domain/models/authentication'
import { FacebookAuth } from '@/domain/features/facebook-authentication'
import { badRequest, unauthorized, HttpResponse, ok, serverError } from '@/application/helpers'
import { RequiredFieldError } from '@/application/errors'

export class FacebookLoginController {
  constructor (
    private readonly facebookAuth: FacebookAuth
  ) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return badRequest(new RequiredFieldError('token'))
      }
      const token = await this.facebookAuth.perform({ token: httpRequest.token })
      if (token instanceof AccessToken) {
        return ok({ accessToken: token.value })
      } else {
        return unauthorized()
      }
    } catch (error: any) {
      return serverError(error)
    }
  }
}

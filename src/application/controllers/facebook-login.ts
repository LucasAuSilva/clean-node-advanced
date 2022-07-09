import { AccessToken } from '@/domain/models/authentication'
import { FacebookAuth } from '@/domain/features/facebook-authentication'
import { badRequest, forbidden, HttpResponse, ok, serverError } from '@/application/helpers'

export class FacebookLoginController {
  constructor (
    private readonly facebookAuth: FacebookAuth
  ) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return badRequest(new Error('The field token is required'))
      }
      const result = await this.facebookAuth.perform({ token: httpRequest.token })
      if (result instanceof AccessToken) {
        return ok({ accessToken: result.value })
      } else {
        return forbidden(result)
      }
    } catch (error: any) {
      return serverError(error)
    }
  }
}

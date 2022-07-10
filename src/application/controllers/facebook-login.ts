import { AccessToken } from '@/domain/models/authentication'
import { FacebookAuth } from '@/domain/features/facebook-authentication'
import { badRequest, unauthorized, HttpResponse, ok, serverError } from '@/application/helpers'
import { RequiredStringValidator, ValidationComposite } from '@/application/validation'

type HttpRequest = {
  token: string | undefined | null
}

type Model = Error | { accessToken: string }

export class FacebookLoginController {
  constructor (
    private readonly facebookAuth: FacebookAuth
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const error = this.validate(httpRequest)
      if (error !== undefined) {
        return badRequest(error)
      }
      const token = await this.facebookAuth.perform({ token: httpRequest.token as string })
      if (token instanceof AccessToken) {
        return ok({ accessToken: token.value })
      } else {
        return unauthorized()
      }
    } catch (error: any) {
      return serverError(error)
    }
  }

  private validate (httpRequest: HttpRequest): Error | undefined {
    return new ValidationComposite(
      [new RequiredStringValidator(httpRequest.token as string, 'token')]
    ).validate()
  }
}

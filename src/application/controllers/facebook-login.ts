import { AccessToken } from '@/domain/models/authentication'
import { FacebookAuth } from '@/domain/features/facebook-authentication'
import { Controller } from '@/application/controllers'
import { ValidationBuilder } from '@/application/validation'
import { unauthorized, HttpResponse, ok } from '@/application/helpers'
import { Validator } from '../contracts'

type HttpRequest = {
  token: string | undefined | null
}

type Model = Error | { accessToken: string }

export class FacebookLoginController extends Controller {
  constructor (
    private readonly facebookAuth: FacebookAuth
  ) { super() }

  async perform (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    const token = await this.facebookAuth.perform({ token: httpRequest.token as string })
    return token instanceof AccessToken
      ? ok({ accessToken: token.value })
      : unauthorized()
  }

  override buildValidators (httpRequest: HttpRequest): Validator[] {
    return ValidationBuilder
      .of({ value: httpRequest.token as string, fieldName: 'token' })
      .required()
      .build()
  }
}

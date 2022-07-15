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

  async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const accessToken = await this.facebookAuth.perform({ token: token as string })
      return ok(accessToken)
    } catch {
      return unauthorized()
    }
  }

  override buildValidators ({ token }: HttpRequest): Validator[] {
    return ValidationBuilder
      .of({ value: token as string, fieldName: 'token' })
      .required()
      .build()
  }
}

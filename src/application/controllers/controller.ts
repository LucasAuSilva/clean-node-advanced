import { badRequest, HttpResponse, serverError } from '@/application/helpers'
import { ValidationComposite } from '@/application/validation'
import { Validator } from '@/application/contracts'

export abstract class Controller {
  abstract perform (httpRequest: any): Promise<HttpResponse>

  buildValidators (_httpRequest: any): Validator[] {
    return []
  }

  async handle (httpRequest: any): Promise<HttpResponse> {
    const validationError = this.validate(httpRequest)
    if (validationError !== undefined) {
      return badRequest(validationError)
    }
    try {
      return await this.perform(httpRequest)
    } catch (error: any) {
      return serverError(error)
    }
  }

  private validate (httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest)
    return new ValidationComposite(validators).validate()
  }
}

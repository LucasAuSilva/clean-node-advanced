import { FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthService } from '@/main/factories/services'

export const makeFacebookLoginController = (): FacebookLoginController => {
  const fbAuthService = makeFacebookAuthService()
  return new FacebookLoginController(fbAuthService)
}

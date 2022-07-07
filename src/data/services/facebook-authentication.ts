import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthDto } from '@/domain/features/facebook-authentication'
import { LoadFacebookUserApi } from '@/data/contracts/apis/facebook'
import { CreateFacebookAccountRepository, LoadAccountByEmailRepository } from '@/data/contracts/repositories/account'

export class FacebookAuthService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly accountRepo: LoadAccountByEmailRepository & CreateFacebookAccountRepository
  ) {}

  async perform (dto: FacebookAuthDto): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(dto.token)
    if (fbData !== undefined) {
      await this.accountRepo.loadByEmail({ email: fbData.email })
      await this.accountRepo.createFromFacebook(fbData)
    }
    return new AuthenticationError()
  }
}

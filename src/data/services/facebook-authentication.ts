import { FacebookAccount } from '@/domain/models/account'
import { FacebookAuthDto } from '@/domain/features/facebook-authentication'
import { AuthenticationError } from '@/domain/errors'
import { LoadFacebookUserApi } from '@/data/contracts/apis/facebook'
import {
  LoadAccountByEmailRepository,
  SaveFacebookAccountRepository
} from '@/data/contracts/repositories/account'

export class FacebookAuthService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly accountRepo: LoadAccountByEmailRepository & SaveFacebookAccountRepository
  ) {}

  async perform (dto: FacebookAuthDto): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(dto.token)
    if (fbData !== undefined) {
      const accountData = await this.accountRepo.loadByEmail({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      await this.accountRepo.saveWithFacebook(fbAccount)
    }
    return new AuthenticationError()
  }
}

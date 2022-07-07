import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthDto } from '@/domain/features/facebook-authentication'
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
      await this.accountRepo.saveWithFacebook({
        id: accountData?.id,
        name: accountData?.name ?? fbData.name,
        email: fbData.email,
        facebookId: fbData.facebookId
      })
    }
    return new AuthenticationError()
  }
}

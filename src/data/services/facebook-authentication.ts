import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthDto } from '@/domain/features/facebook-authentication'
import { LoadFacebookUserApi } from '@/data/contracts/apis/facebook'
import {
  CreateFacebookAccountRepository, LoadAccountByEmailRepository,
  UpdateFacebookAccountRepository
} from '@/data/contracts/repositories/account'

export class FacebookAuthService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly accountRepo: LoadAccountByEmailRepository & CreateFacebookAccountRepository
    & UpdateFacebookAccountRepository
  ) {}

  async perform (dto: FacebookAuthDto): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(dto.token)
    if (fbData !== undefined) {
      const accountData = await this.accountRepo.loadByEmail({ email: fbData.email })
      if (accountData !== undefined) {
        await this.accountRepo.updateWithFacebook({
          id: accountData.id,
          name: accountData.name ?? fbData.name,
          facebookId: fbData.facebookId
        })
      }
      await this.accountRepo.createFromFacebook(fbData)
    }
    return new AuthenticationError()
  }
}

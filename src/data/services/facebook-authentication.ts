import { FacebookAccount } from '@/domain/models/account'
import { FacebookAuth, FacebookAuthDto } from '@/domain/features/facebook-authentication'
import { AuthenticationError } from '@/domain/errors'
import { TokenGenerator } from '@/data/contracts/crypto'
import { LoadFacebookUserApi } from '@/data/contracts/apis/facebook'
import {
  LoadAccountByEmailRepository,
  SaveFacebookAccountRepository
} from '@/data/contracts/repositories/account'
import { AccessToken } from '@/domain/models/authentication'

export class FacebookAuthService implements FacebookAuth {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly accountRepo: LoadAccountByEmailRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  async perform (dto: FacebookAuthDto): Promise<{accessToken: string}> {
    const fbData = await this.facebookApi.loadUser({ token: dto.token })
    if (fbData !== undefined) {
      const accountData = await this.accountRepo.loadByEmail({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      const { id } = await this.accountRepo.saveWithFacebook(fbAccount)
      const accessToken = await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
      return { accessToken }
    }
    throw new AuthenticationError()
  }
}

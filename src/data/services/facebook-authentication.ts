import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthDto } from '@/domain/features/facebook-authentication'
import { LoadFacebookUserApi } from '@/data/contracts/apis/facebook'
import { CreateFacebookAccountRepository, LoadAccountByEmailRepository } from '@/data/contracts/repositories/account'

export class FacebookAuthService {
  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly createFacebookAccountRepository: CreateFacebookAccountRepository
  ) {}

  async perform (dto: FacebookAuthDto): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserByTokenApi.loadUser(dto.token)
    if (fbData !== undefined) {
      await this.loadAccountByEmailRepository.loadByEmail({ email: fbData.email })
      await this.createFacebookAccountRepository.createFromFacebook(fbData)
    }
    return new AuthenticationError()
  }
}

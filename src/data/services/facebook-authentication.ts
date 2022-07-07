import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationDto } from '@/domain/features/facebook-authentication'
import { LoadFacebookUserApi } from '@/data/contracts/apis/facebook'
import { LoadAccountByEmailRepository } from '@/data/contracts/repositories'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async perform (dto: FacebookAuthenticationDto): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserByTokenApi.loadUser(dto.token)
    if (fbData !== undefined) {
      await this.loadAccountByEmailRepository.loadByEmail({ email: fbData.email })
    }
    return new AuthenticationError()
  }
}

import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationDto } from '@/domain/features/facebook-authentication'
import { LoadFacebookUserApi } from '@/data/contracts/apis/facebook'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi
  ) {}

  async perform (dto: FacebookAuthenticationDto): Promise<AuthenticationError> {
    await this.loadFacebookUserByTokenApi.loadUser(dto.token)
    return new AuthenticationError()
  }
}

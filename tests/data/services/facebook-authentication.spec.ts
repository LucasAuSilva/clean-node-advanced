import { FacebookAuthenticationDto } from '@/domain/features/facebook-authentication'

class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi
  ) {}

  async perform (dto: FacebookAuthenticationDto): Promise<void> {
    await this.loadFacebookUserByTokenApi.loadUser(dto.token)
  }
}

interface LoadFacebookUserApi {
  loadUser: (token: string) => Promise<void>
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string

  async loadUser (token: string): Promise<void> {
    this.token = token
  }
}

describe('Facebook Authentication Service', () => {
  it('should call LoadFacebookUserApi with correct values', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApi.token).toBe('any_token')
  })
})

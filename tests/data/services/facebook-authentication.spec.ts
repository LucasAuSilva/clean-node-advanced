import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationDto } from '@/domain/features/facebook-authentication'

class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi
  ) {}

  async perform (dto: FacebookAuthenticationDto): Promise<AuthenticationError> {
    await this.loadFacebookUserByTokenApi.loadUser(dto.token)
    return new AuthenticationError()
  }
}

interface LoadFacebookUserApi {
  loadUser: (token: string) => Promise<LoadFacebookUserApiReturn>
}

type LoadFacebookUserApiReturn = undefined

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  result = undefined

  async loadUser (token: string): Promise<LoadFacebookUserApiReturn> {
    this.token = token
    return this.result
  }
}

describe('Facebook Authentication Service', () => {
  it('should call LoadFacebookUserApi with correct values', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApi.token).toBe('any_token')
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    loadFacebookUserApi.result = undefined
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    const authResult = await sut.perform({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})

import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services/facebook-authentication'
import { LoadFacebookUserApi, LoadFacebookUserApiReturn } from '@/data/contracts/apis/facebook'

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  callsCount = 0
  result = undefined

  async loadUser (token: string): Promise<LoadFacebookUserApiReturn> {
    this.token = token
    this.callsCount++
    return this.result
  }
}

describe('Facebook Authentication Service', () => {
  it('should call LoadFacebookUserApi with correct values', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApi.token).toBe('any_token')
    expect(loadFacebookUserApi.callsCount).toBe(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    loadFacebookUserApi.result = undefined
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    const authResult = await sut.perform({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})

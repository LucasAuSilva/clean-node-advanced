import { FacebookApi } from '@/infra/apis/facebook'
import { HttpGetClient } from '@/infra/http/client'

import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: FacebookApi
  httpClient: MockProxy<HttpGetClient>
}

const makeSut = (): SutTypes => {
  const httpClient = mock<HttpGetClient>()
  httpClient.get
    .mockResolvedValueOnce({ access_token: 'any_app_token' })
    .mockResolvedValueOnce({ data: { user_id: 'any_user_id' } })
    .mockResolvedValueOnce({ id: 'any_fb_id', name: 'any_fb_name', email: 'any_fb_email' })
  const sut = new FacebookApi(httpClient, clientId, clientSecret)
  return {
    sut,
    httpClient
  }
}

const clientId = 'any_client_id'
const clientSecret = 'any_client_secret'
const token = 'any_client_token'

describe('Facebook API', () => {
  it('should get app token', async () => {
    const { sut, httpClient } = makeSut()
    await sut.loadUser({ token })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })
  })

  it('should get debug token', async () => {
    const { sut, httpClient } = makeSut()
    await sut.loadUser({ token })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token'
      }
    })
  })

  it('should get user info', async () => {
    const { sut, httpClient } = makeSut()
    await sut.loadUser({ token })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/any_user_id',
      params: {
        fields: 'id,name,email',
        access_token: 'any_client_token'
      }
    })
  })

  it('should return facebook user', async () => {
    const { sut } = makeSut()
    const fbUser = await sut.loadUser({ token })

    expect(fbUser).toEqual({
      facebookId: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_fb_email'
    })
  })

  it('should return undefined if HttpGetClient throws', async () => {
    const { sut, httpClient } = makeSut()
    httpClient.get.mockReset().mockRejectedValueOnce(new Error('http_error'))
    const fbUser = await sut.loadUser({ token })

    expect(fbUser).toBe(undefined)
  })
})

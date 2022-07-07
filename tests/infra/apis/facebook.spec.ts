import { FacebookApi } from '@/infra/apis/facebook'
import { HttpGetClient } from '@/infra/http/client'

import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: FacebookApi
  httpClient: MockProxy<HttpGetClient>
}

const makeSut = (): SutTypes => {
  const httpClient = mock<HttpGetClient>()
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
})

import { LoadFacebookUserApiDto } from '@/data/contracts/apis/facebook'

import { mock, MockProxy } from 'jest-mock-extended'

class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com'
  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (dto: LoadFacebookUserApiDto): Promise<void> {
    await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }
}

interface HttpGetClient {
  get: (dto: HttpGetClientDto) => Promise<void>
}

type HttpGetClientDto = {
  url: string
  params: object
}

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

describe('Facebook API', () => {
  const token = 'any_client_token'

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

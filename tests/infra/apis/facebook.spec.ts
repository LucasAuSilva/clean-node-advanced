import { LoadFacebookUserApiDto } from '@/data/contracts/apis/facebook'
import { mock } from 'jest-mock-extended'

class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com'
  constructor (
    private readonly httpClient: HttpGetClient
  ) {}

  async loadUser (dto: LoadFacebookUserApiDto): Promise<void> {
    await this.httpClient.get({ url: `${this.baseUrl}/oauth/access_token` })
  }
}

const token = 'any_client_token'

interface HttpGetClient {
  get: (dto: HttpGetClientDto) => Promise<void>
}

type HttpGetClientDto = {
  url: string
}

describe('Facebook API', () => {
  it('should get app token', async () => {
    const httpClient = mock<HttpGetClient>()
    const sut = new FacebookApi(httpClient)
    await sut.loadUser({ token })
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token'
    })
  })
})

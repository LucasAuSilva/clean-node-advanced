import { LoadFacebookUserApi, LoadFacebookUserApiDto, LoadFacebookUserApiResult } from '@/data/contracts/apis/facebook'
import { HttpGetClient } from '@/infra/http/client'

export class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com'
  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (dto: LoadFacebookUserApiDto): Promise<LoadFacebookUserApiResult> {
    const appToken = await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })

    const debugToken = await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        access_token: appToken.access_token,
        input_token: dto.token
      }
    })

    const userInfo = await this.httpClient.get({
      url: `${this.baseUrl}/oauth/${debugToken.data.user_id as string}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: dto.token
      }
    })

    return {
      facebookId: userInfo.id,
      name: userInfo.name,
      email: userInfo.email
    }
  }
}

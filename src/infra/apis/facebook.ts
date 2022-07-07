import { LoadFacebookUserApi, LoadFacebookUserApiDto, LoadFacebookUserApiResult } from '@/data/contracts/apis/facebook'
import { HttpGetClient } from '@/infra/http/client'

type UserInfo = {
  id: string
  name: string
  email: string
}

type AppToken = {
  access_token: string
}

type DebugToken = {
  data: {
    user_id: string
  }
}

export class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com'
  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (dto: LoadFacebookUserApiDto): Promise<LoadFacebookUserApiResult> {
    const userInfo = await this.getUserInfo(dto.token)
    return {
      facebookId: userInfo.id,
      name: userInfo.name,
      email: userInfo.email
    }
  }

  private async getUserInfo (clientToken: string): Promise<UserInfo> {
    const debugToken = await this.getDebugToken(clientToken)
    return this.httpClient.get({
      url: `${this.baseUrl}/oauth/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken
      }
    })
  }

  private async getDebugToken (clientToken: string): Promise<DebugToken> {
    const appToken = await this.getAppToken()
    return this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        access_token: appToken.access_token,
        input_token: clientToken
      }
    })
  }

  private async getAppToken (): Promise<AppToken> {
    return this.httpClient.get<AppToken>({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }
}

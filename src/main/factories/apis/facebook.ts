import { FacebookApi } from '@/infra/apis/facebook'
import { makeAxiosHttpClient } from '@/main/factories/http'
import { env } from '@/main/config/env'

export const makeFacebookApi = (): FacebookApi => {
  const axiosClient = makeAxiosHttpClient()
  return new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)
}

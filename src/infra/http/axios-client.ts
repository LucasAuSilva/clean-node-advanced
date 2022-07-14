import { HttpGetClient, HttpGetClientDto } from '@/infra/http'

import axios from 'axios'

export class AxiosHttpClient implements HttpGetClient {
  async get ({ url, params }: HttpGetClientDto): Promise<any> {
    const result = await axios.get(url, { params })
    return result.data
  }
}

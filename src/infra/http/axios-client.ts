import { HttpGetClient, HttpGetClientDto } from '@/infra/http'

import axios from 'axios'

export class AxiosHttpClient implements HttpGetClient {
  async get <T = any> ({ url, params }: HttpGetClientDto): Promise<T> {
    const result = await axios.get(url, { params })
    return result.data
  }
}

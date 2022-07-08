import { HttpGetClient, HttpGetClientDto } from '@/infra/http'

import axios from 'axios'

export class AxiosHttpClient implements HttpGetClient {
  async get <T = any> (dto: HttpGetClientDto): Promise<T> {
    const result = await axios.get(dto.url, { params: dto.params })
    return result.data
  }
}

import { HttpGetClientDto } from '@/infra/http'

import axios from 'axios'

export class AxiosHttpClient {
  async get (dto: HttpGetClientDto): Promise<any> {
    const result = await axios.get(dto.url, { params: dto.params })
    return result.data
  }
}

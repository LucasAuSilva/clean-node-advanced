import { HttpGetClientDto } from './client'

import axios from 'axios'

class AxiosHttpClient {
  async get (dto: HttpGetClientDto): Promise<void> {
    await axios.get(dto.url, { params: dto.params })
  }
}

jest.mock('axios')

describe('AxiosHttp Client', () => {
  describe('get', () => {
    it('should call get with correct params', async () => {
      const fakeAxios = axios as jest.Mocked<typeof axios>
      const sut = new AxiosHttpClient()
      await sut.get({
        url: 'any_url',
        params: {
          any: 'any'
        }
      })

      expect(fakeAxios.get).toHaveBeenCalledWith('any_url', {
        params: {
          any: 'any'
        }
      })
      expect(axios.get).toHaveBeenCalledTimes(1)
    })
  })
})

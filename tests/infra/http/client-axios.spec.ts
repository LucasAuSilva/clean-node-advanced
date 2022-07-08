import { HttpGetClientDto } from './client'

import axios from 'axios'

jest.mock('axios')

class AxiosHttpClient {
  async get (dto: HttpGetClientDto): Promise<void> {
    await axios.get(dto.url, { params: dto.params })
  }
}

type SutTypes = {
  sut: AxiosHttpClient
  fakeAxios: jest.Mocked<typeof axios>
}

const makeSut = (): SutTypes => {
  const fakeAxios = axios as jest.Mocked<typeof axios>
  const sut = new AxiosHttpClient()
  return {
    sut,
    fakeAxios
  }
}

const url = 'any_url'
const params = { any: 'any' }

describe('AxiosHttp Client', () => {
  describe('get', () => {
    it('should call get with correct values', async () => {
      const { sut, fakeAxios } = makeSut()
      await sut.get({ url, params })

      expect(fakeAxios.get).toHaveBeenCalledWith(url, { params })
      expect(axios.get).toHaveBeenCalledTimes(1)
    })
  })
})

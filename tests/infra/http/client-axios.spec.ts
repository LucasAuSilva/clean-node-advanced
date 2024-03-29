import { AxiosHttpClient } from '@/infra/http'

import axios from 'axios'

jest.mock('axios')

type SutTypes = {
  sut: AxiosHttpClient
  fakeAxios: jest.Mocked<typeof axios>
}

const makeSut = (): SutTypes => {
  const fakeAxios = axios as jest.Mocked<typeof axios>
  fakeAxios.get.mockResolvedValue({
    status: 200,
    data: 'any_data'
  })
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

    it('should return data on success', async () => {
      const { sut } = makeSut()
      const result = await sut.get({ url, params })

      expect(result).toEqual('any_data')
    })

    it('should rethrow if get throws', async () => {
      const { sut, fakeAxios } = makeSut()
      fakeAxios.get.mockRejectedValueOnce(new Error('http_error'))
      const promise = sut.get({ url, params })

      await expect(promise).rejects.toThrow(new Error('http_error'))
    })
  })
})

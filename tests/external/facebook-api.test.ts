import { FacebookApi } from '@/infra/apis/facebook'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

type SutTypes = {
  sut: FacebookApi
  axiosClient: AxiosHttpClient
}

const makeSut = (): SutTypes => {
  const axiosClient = new AxiosHttpClient()
  const sut = new FacebookApi(
    axiosClient,
    env.facebookApi.clientId,
    env.facebookApi.clientSecret
  )
  return {
    sut,
    axiosClient
  }
}

describe('Facebook API Integration Tests', () => {
  it('should return a facebook user if token is valid', async () => {
    const { sut } = makeSut()

    // Access token only valid for 3 months, check before test fails
    const fbUser = await sut.loadUser({ token: 'EABLuhIey9AsBAF0UkCeHZAjmV4Gs4PtYJcJxrevfPtlW71Qea5jvhQ4IlXSVxRUGwfiMGZCRRhDCDaIFXzLq4iqdsVVC2nZAlM1dYjdeoOMr1yZBYhT0nkeqQAI0qNncZB6l5vTBYkomtgd3dK3TOdKjA11hgZBPvtUDQoAAdW6jMIHHvSSXaoOdvCbDqORQWpYZA5ZAFKCRyAZDZD' })

    expect(fbUser).toEqual({
      facebookId: '102788015843102',
      email: 'bento_jvxnfra_teste@tfbnw.net',
      name: 'Bento teste'
    })
  })

  it('should return undefined if token is invalid', async () => {
    const { sut } = makeSut()

    // Access token only valid for 3 months, check before test fails
    const fbUser = await sut.loadUser({ token: 'invalid' })

    expect(fbUser).toBe(undefined)
  })
})

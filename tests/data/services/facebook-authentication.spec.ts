import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadAccountByEmailRepository } from '@/data/contracts/repositories'
import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: FacebookAuthenticationService
  loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  loadAccountByEmailRepo: MockProxy<LoadAccountByEmailRepository>
}

const makeSut = (): SutTypes => {
  const loadFacebookUserApi = mock<LoadFacebookUserApi>()
  loadFacebookUserApi.loadUser.mockResolvedValue({
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id'
  })
  const loadAccountByEmailRepo = mock<LoadAccountByEmailRepository>()
  const sut = new FacebookAuthenticationService(loadFacebookUserApi, loadAccountByEmailRepo)
  return {
    sut,
    loadFacebookUserApi,
    loadAccountByEmailRepo
  }
}

describe('Facebook Authentication Service', () => {
  const token = 'any_token'

  it('should call LoadFacebookUserApi with correct values', async () => {
    const { sut, loadFacebookUserApi } = makeSut()
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith(token)
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const { sut, loadFacebookUserApi } = makeSut()
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserByEmailRepo when LoadFacebookUserApi returns data', async () => {
    const { sut, loadAccountByEmailRepo } = makeSut()
    await sut.perform({ token })
    expect(loadAccountByEmailRepo.loadByEmail).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(loadAccountByEmailRepo.loadByEmail).toHaveBeenCalledTimes(1)
  })
})

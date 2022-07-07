import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthService } from '@/data/services'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import {
  LoadAccountByEmailRepository,
  SaveFacebookAccountRepository
} from '@/data/contracts/repositories/account'
import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: FacebookAuthService
  facebookApi: MockProxy<LoadFacebookUserApi>
  accountRepo: MockProxy<LoadAccountByEmailRepository & SaveFacebookAccountRepository>
}

const makeSut = (): SutTypes => {
  const facebookApi = mock<LoadFacebookUserApi>()
  facebookApi.loadUser.mockResolvedValue({
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id'
  })
  const accountRepo = mock< LoadAccountByEmailRepository & SaveFacebookAccountRepository>()
  const sut = new FacebookAuthService(facebookApi, accountRepo)
  return {
    sut,
    facebookApi,
    accountRepo
  }
}

describe('Facebook Authentication Service', () => {
  const token = 'any_token'

  it('should call LoadFacebookUserApi with correct values', async () => {
    const { sut, facebookApi } = makeSut()
    await sut.perform({ token: 'any_token' })
    expect(facebookApi.loadUser).toHaveBeenCalledWith(token)
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const { sut, facebookApi } = makeSut()
    facebookApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserByEmailRepo when LoadFacebookUserApi returns data', async () => {
    const { sut, accountRepo } = makeSut()
    await sut.perform({ token })
    expect(accountRepo.loadByEmail).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(accountRepo.loadByEmail).toHaveBeenCalledTimes(1)
  })

  it('should call create account with facebook data', async () => {
    const { sut, accountRepo } = makeSut()
    accountRepo.loadByEmail.mockResolvedValueOnce(undefined)
    await sut.perform({ token })
    expect(accountRepo.saveWithFacebook).toHaveBeenCalledWith({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id'
    })
    expect(accountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should not update account name', async () => {
    const { sut, accountRepo } = makeSut()
    accountRepo.loadByEmail.mockResolvedValueOnce({
      id: 'any_fb_id',
      name: 'any_name'
    })
    await sut.perform({ token })
    expect(accountRepo.saveWithFacebook).toHaveBeenCalledWith({
      id: 'any_fb_id',
      name: 'any_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    expect(accountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should update account name', async () => {
    const { sut, accountRepo } = makeSut()
    accountRepo.loadByEmail.mockResolvedValueOnce({
      id: 'any_fb_id'
    })
    await sut.perform({ token })
    expect(accountRepo.saveWithFacebook).toHaveBeenCalledWith({
      id: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    expect(accountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })
})

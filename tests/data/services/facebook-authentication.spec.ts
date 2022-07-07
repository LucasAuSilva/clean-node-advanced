import { FacebookAccount } from '@/domain/models/account'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthService } from '@/data/services'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import {
  LoadAccountByEmailRepository,
  SaveFacebookAccountRepository
} from '@/data/contracts/repositories/account'

import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/account/facebook-account')

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

  it('should call SaveFacebookAccountRepository with correct FacebookAccount', async () => {
    const { sut, accountRepo } = makeSut()
    const facebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    jest.mocked(FacebookAccount).mockImplementation(facebookAccountStub)

    await sut.perform({ token })
    expect(accountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(accountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })
})

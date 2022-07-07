import { AccessToken } from '@/domain/models/authentication'
import { FacebookAccount } from '@/domain/models/account'
import { AuthenticationError } from '@/domain/errors'
import { TokenGenerator } from '@/data/contracts/crypto'
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
  crypto: MockProxy<TokenGenerator>
}

const makeSut = (): SutTypes => {
  const accountRepo = mock<SaveFacebookAccountRepository & LoadAccountByEmailRepository>()
  const facebookApi = mock<LoadFacebookUserApi>()
  const crypto = mock<TokenGenerator>()
  facebookApi.loadUser.mockResolvedValue({
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id'
  })
  accountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
  crypto.generateToken.mockResolvedValue('any_generated_token')
  const sut = new FacebookAuthService(facebookApi, accountRepo, crypto)
  return {
    sut,
    facebookApi,
    accountRepo,
    crypto
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

  it('should call TokenGenerator with correct values', async () => {
    const { sut, crypto } = makeSut()

    await sut.perform({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  it('should return an access token on success', async () => {
    const { sut } = makeSut()

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AccessToken('any_generated_token'))
  })

  it('should rethrow if LoadFacebookUserApi throws', async () => {
    const { sut, facebookApi } = makeSut()
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  it('should rethrow if LoadAccountByEmailRepository throws', async () => {
    const { sut, accountRepo } = makeSut()
    accountRepo.loadByEmail.mockRejectedValueOnce(new Error('load_error'))

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('should rethrow if SaveFacebookAccountRepository throws', async () => {
    const { sut, accountRepo } = makeSut()
    accountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('should rethrow if TokenGenerator throws', async () => {
    const { sut, crypto } = makeSut()
    crypto.generateToken.mockRejectedValueOnce(new Error('generator_error'))

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(new Error('generator_error'))
  })
})

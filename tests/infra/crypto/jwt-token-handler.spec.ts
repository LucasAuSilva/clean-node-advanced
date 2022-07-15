import { JwtTokenHandler } from '@/infra/crypto'

import jwt from 'jsonwebtoken'
jest.mock('jsonwebtoken')

type SutTypes = {
  sut: JwtTokenHandler
  fakeJwt: jest.Mocked<typeof jwt>
}

const makeSut = (): SutTypes => {
  const fakeJwt = jwt as jest.Mocked<typeof jwt>
  fakeJwt.sign.mockImplementation(() => 'any_token')
  const sut = new JwtTokenHandler('any_secret')
  return {
    sut,
    fakeJwt
  }
}

describe('JwtToken Handler', () => {
  describe('generateToken()', () => {
    const key = 'any_key'
    const expirationInMs = 1000

    it('should call sign with correct values', async () => {
      const { sut, fakeJwt } = makeSut()
      await sut.generateToken({
        key,
        expirationInMs
      })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, 'any_secret', { expiresIn: 1 })
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    })

    it('should return a token', async () => {
      const { sut } = makeSut()
      const generatedToken = await sut.generateToken({
        key,
        expirationInMs
      })

      expect(generatedToken).toBe('any_token')
    })

    it('should rethrow if get throws', async () => {
      const { sut, fakeJwt } = makeSut()
      fakeJwt.sign.mockImplementationOnce(() => { throw new Error('crypto_error') })
      const promise = sut.generateToken({
        key,
        expirationInMs
      })

      await expect(promise).rejects.toThrow(new Error('crypto_error'))
    })
  })
})

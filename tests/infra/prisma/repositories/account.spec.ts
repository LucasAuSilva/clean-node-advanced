import { PrismaAccountRepository } from '@/infra/prisma/repositories'
import { PrismaHelper } from '@/tests/infra/prisma/helpers'

import { PrismaClient } from '@prisma/client'

type SutTypes = {
  sut: PrismaAccountRepository
  prisma: PrismaClient
}

const makeSut = async (): Promise<SutTypes> => {
  const sut = new PrismaAccountRepository()
  const prisma = await PrismaHelper.connect()
  return {
    sut,
    prisma
  }
}

describe('PrismaAccount Repository', () => {
  afterAll(async () => {
    await PrismaHelper.disconnect()
  })

  afterEach(async () => {
    const prisma = await PrismaHelper.connect()
    await prisma.account.deleteMany({})
    await PrismaHelper.disconnect()
  })

  describe('loadByEmail', () => {
    it('should return an account if email exists', async () => {
      const { sut, prisma } = await makeSut()
      const result = await prisma.account.create({
        data: {
          email: 'any_email'
        }
      })

      const account = await sut.loadByEmail({ email: 'any_email' })

      expect(account).toEqual({ id: result.id.toString(), name: undefined })
    })

    it('should return undefined if email does not exists', async () => {
      const { sut } = await makeSut()
      const account = await sut.loadByEmail({ email: 'any_email' })

      expect(account).toBeUndefined()
    })
  })

  describe('saveWithFacebook', () => {
    it('should create an account if id is undefined', async () => {
      const { sut, prisma } = await makeSut()

      await sut.saveWithFacebook({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })
      const account = await prisma.account.findMany({ where: { email: 'any_email' } })

      expect(account.length).toBe(1)
      expect(account[0]?.id).toBeTruthy()
      expect(account[0]?.name).toBe('any_name')
      expect(account[0]?.facebookId).toBe('any_fb_id')
    })

    it('should update an account if id is defined', async () => {
      const { sut, prisma } = await makeSut()

      const result = await prisma.account.create({
        data: {
          email: 'any_email',
          name: 'any_name',
          facebookId: 'any_fb_id'
        }
      })
      await sut.saveWithFacebook({
        id: result.id.toString(),
        email: 'other_email',
        name: 'other_name',
        facebookId: 'other_fb_id'
      })
      const account = await prisma.account.findMany({ where: { id: result.id } })

      expect(account.length).toBe(1)
      expect(account[0]).toEqual({
        id: result.id,
        email: 'any_email',
        name: 'other_name',
        facebookId: 'other_fb_id'
      })
    })
  })
})

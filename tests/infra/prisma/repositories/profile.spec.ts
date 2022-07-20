import { PrismaProfileRepository } from '@/infra/prisma/repositories'
import { PrismaHelper } from '@/tests/infra/prisma/helpers'

import { PrismaClient } from '@prisma/client'

type SutTypes = {
  sut: PrismaProfileRepository
  prisma: PrismaClient
}

const makeSut = async (): Promise<SutTypes> => {
  const sut = new PrismaProfileRepository()
  const prisma = await PrismaHelper.connect()
  return {
    sut,
    prisma
  }
}

describe('PrismaProfile Repository', () => {
  afterAll(async () => {
    await PrismaHelper.disconnect()
  })

  afterEach(async () => {
    const prisma = await PrismaHelper.connect()
    await prisma.account.deleteMany({})
    await PrismaHelper.disconnect()
  })

  describe('savePicture()', () => {
    it('should update profile with pictureUrl', async () => {
      const { sut, prisma } = await makeSut()
      const { id } = await prisma.account.create({ data: { email: 'any_email', initials: 'any_initials' } })
      await sut.savePicture(id.toString(), 'any_url')
      const profile = await prisma.account.findUnique({ where: { id } })
      expect(profile).toMatchObject({ id, pictureUrl: 'any_url', initials: null })
    })

    it('should update profile with initials', async () => {
      const { sut, prisma } = await makeSut()
      const { id } = await prisma.account.create({ data: { email: 'any_email', pictureUrl: 'any_url' } })
      await sut.savePicture(id.toString(), undefined, 'any_initials')
      const profile = await prisma.account.findUnique({ where: { id } })
      expect(profile).toMatchObject({ id, pictureUrl: null, initials: 'any_initials' })
    })
  })

  describe('loadById()', () => {
    it('should load profile', async () => {
      const { sut, prisma } = await makeSut()
      const { id } = await prisma.account.create({ data: { email: 'any_email', name: 'any_name' } })
      const name = await sut.loadById(id.toString())
      expect(name).toBe('any_name')
    })

    it('should return undefined', async () => {
      const { sut } = await makeSut()
      const name = await sut.loadById('0')
      expect(name).toBeUndefined()
    })
  })
})

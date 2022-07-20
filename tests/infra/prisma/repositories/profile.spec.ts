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
    it('should update user profile', async () => {
      const { sut, prisma } = await makeSut()
      const { id } = await prisma.account.create({ data: { email: 'any_email', initials: 'any_initials' } })
      await sut.savePicture(id.toString(), 'any_url')
      const profile = await prisma.account.findUnique({ where: { id } })
      expect(profile).toMatchObject({ id, pictureUrl: 'any_url', initials: null })
    })
  })
})

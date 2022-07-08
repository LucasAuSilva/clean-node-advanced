import {
  LoadAccountByEmailRepository,
  LoadAccountByEmailRepositoryDto,
  LoadAccountByEmailRepositoryResult
} from '@/data/contracts/repositories/account'
import { PrismaHelper } from '@/infra/prisma/helpers'

import { PrismaClient } from '@prisma/client'

class PrismaAccountRepository implements LoadAccountByEmailRepository {
  async loadByEmail (dto: LoadAccountByEmailRepositoryDto): Promise<LoadAccountByEmailRepositoryResult> {
    const prisma = await PrismaHelper.connect()
    const account = await prisma.account.findFirst({ where: { email: dto.email } })
    if (account !== null) {
      return {
        id: account.id.toString(),
        name: account.name ?? undefined
      }
    }
  }
}

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
    await prisma.$disconnect()
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
})
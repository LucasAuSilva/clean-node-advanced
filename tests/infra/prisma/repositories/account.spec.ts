import {
  LoadAccountByEmailRepository,
  LoadAccountByEmailRepositoryDto,
  LoadAccountByEmailRepositoryResult
} from '@/data/contracts/repositories/account'
import { PrismaHelper } from '@/infra/prisma/helpers'

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

describe('PrismaAccount Repository', () => {
  afterAll(async () => {
    await PrismaHelper.disconnect()
  })

  afterEach(async () => {
    const prisma = await PrismaHelper.connect()
    await prisma.account.deleteMany({})
  })

  describe('loadByEmail', () => {
    it('should return an account if email exists', async () => {
      const sut = new PrismaAccountRepository()
      const prisma = await PrismaHelper.connect()
      const result = await prisma.account.create({
        data: {
          email: 'existing_email'
        }
      })

      const account = await sut.loadByEmail({ email: 'existing_email' })

      expect(account).toEqual({ id: result.id.toString(), name: undefined })
    })

    it('should return undefined if email does not exists', async () => {
      const sut = new PrismaAccountRepository()
      const account = await sut.loadByEmail({ email: 'existing_email' })

      expect(account).toBe(undefined)
    })
  })
})

import { PrismaAccountRepository } from '@/infra/prisma/repositories'

export const makePrismaAccountRepository = (): PrismaAccountRepository => {
  return new PrismaAccountRepository()
}

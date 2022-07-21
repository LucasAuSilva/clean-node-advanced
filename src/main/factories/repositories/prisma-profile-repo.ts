import { PrismaProfileRepository } from '@/infra/prisma/repositories'

export const makePrismaProfileRepository = (): PrismaProfileRepository => {
  return new PrismaProfileRepository()
}

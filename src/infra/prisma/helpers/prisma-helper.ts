import { Prisma, PrismaClient } from '@prisma/client'

type PrismaClientTypeOrNull = PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined> | null
type PrismaClientType = PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>

export const PrismaHelper = {
  client: null as PrismaClientTypeOrNull,

  async connect (): Promise<PrismaClientType> {
    this.client = new PrismaClient()
    return this.client
  },

  async disconnect (): Promise<void> {
    if (this.client !== null) {
      await this.client.$disconnect()
      this.client = null
    }
  }
}

import { PrismaClient } from '@prisma/client'

type PrismaHelperClient = PrismaClient | null

export const PrismaHelper = {
  client: null as PrismaHelperClient,

  async connect (): Promise<PrismaClient> {
    if (this.client === null) {
      this.client = new PrismaClient()
      return this.client
    }
    return this.client
  },

  async disconnect (): Promise<void> {
    if (this.client !== null) {
      await this.client.$disconnect()
      this.client = null
    }
  }
}

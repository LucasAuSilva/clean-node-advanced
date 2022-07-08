import {
  LoadAccountByEmailRepository,
  LoadAccountByEmailRepositoryDto,
  LoadAccountByEmailRepositoryResult,
  SaveFacebookAccountRepositoryDto
} from '@/data/contracts/repositories/account'

import { PrismaClient } from '@prisma/client'

type LoadByEmailDto = LoadAccountByEmailRepositoryDto
type LoadByEmailResult = LoadAccountByEmailRepositoryResult

export class PrismaAccountRepository implements LoadAccountByEmailRepository {
  private readonly prisma: PrismaClient

  constructor () {
    this.prisma = new PrismaClient()
  }

  async loadByEmail (dto: LoadByEmailDto): Promise<LoadByEmailResult> {
    const account = await this.prisma.account.findFirst({ where: { email: dto.email } })
    if (account !== null) {
      return {
        id: account.id.toString(),
        name: account.name ?? undefined
      }
    }
  }

  async saveWithFacebook (dto: SaveFacebookAccountRepositoryDto): Promise<void> {
    const id = dto.id === undefined ? 0 : Number.parseInt(dto.id)
    await this.prisma.account.upsert(
      {
        where: { id },
        create: { email: dto.email, name: dto.name, facebookId: dto.facebookId },
        update: { name: dto.name, facebookId: dto.facebookId }
      })
  }
}

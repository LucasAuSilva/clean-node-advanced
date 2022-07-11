import {
  LoadAccountByEmailRepository,
  LoadAccountByEmailRepositoryDto,
  LoadAccountByEmailRepositoryResult,
  SaveFacebookAccountRepositoryDto,
  SaveFacebookAccountRepositoryResult
} from '@/data/contracts/repositories/account'

import { PrismaClient } from '@prisma/client'

type LoadByEmailDto = LoadAccountByEmailRepositoryDto
type LoadByEmailResult = LoadAccountByEmailRepositoryResult
type SaveWithFacebookDto = SaveFacebookAccountRepositoryDto
type SaveWithFacebookResult = SaveFacebookAccountRepositoryResult

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

  async saveWithFacebook (dto: SaveWithFacebookDto): Promise<SaveWithFacebookResult> {
    const accountRepo = this.prisma.account
    const account = await accountRepo.upsert({
      where: { id: parseInt(dto.id ?? '0') },
      create: { email: dto.email, name: dto.name, facebookId: dto.facebookId },
      update: { name: dto.name, facebookId: dto.facebookId }
    })
    return { id: account.id.toString() }
  }
}

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

  async loadByEmail ({ email }: LoadByEmailDto): Promise<LoadByEmailResult> {
    const account = await this.prisma.account.findFirst({ where: { email } })
    if (account !== null) {
      return {
        id: account.id.toString(),
        name: account.name ?? undefined
      }
    }
  }

  async saveWithFacebook ({ id, name, email, facebookId }: SaveWithFacebookDto): Promise<SaveWithFacebookResult> {
    const accountRepo = this.prisma.account
    const account = await accountRepo.upsert({
      where: { id: parseInt(id ?? '0') },
      create: { email, name, facebookId },
      update: { name, facebookId }
    })
    return { id: account.id.toString() }
  }
}

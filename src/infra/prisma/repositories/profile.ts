import { LoadProfileById, SaveProfilePicture } from '@/data/contracts/repositories/profile'

import { PrismaClient } from '@prisma/client'

export class PrismaProfileRepository implements SaveProfilePicture, LoadProfileById {
  private readonly prisma: PrismaClient

  constructor () {
    this.prisma = new PrismaClient()
  }

  async savePicture (id: string, pictureUrl?: string, initials?: string): Promise<void> {
    await this.prisma.account.update({
      where: { id: parseInt(id) },
      data: {
        pictureUrl: pictureUrl ?? null,
        initials: initials ?? null
      }
    })
  }

  async loadById (id: string): Promise<string | undefined> {
    const profile = await this.prisma.account.findUnique({ where: { id: parseInt(id) }, select: { name: true } })
    if (profile !== null) return profile.name ?? undefined
  }
}

import { SaveProfilePicture } from '@/data/contracts/repositories/profile'

import { PrismaClient } from '@prisma/client'

export class PrismaProfileRepository implements SaveProfilePicture {
  private readonly prisma: PrismaClient

  constructor () {
    this.prisma = new PrismaClient()
  }

  async savePicture (id: string, pictureUrl?: string, initials?: string): Promise<void> {
    await this.prisma.account.update({
      where: { id: parseInt(id) },
      data: {
        pictureUrl: pictureUrl === undefined ? null : pictureUrl,
        initials: initials === undefined ? null : initials
      }
    })
  }
}

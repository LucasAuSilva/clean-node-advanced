import { ChangeProfilePicture } from '@/domain/features/change-profile-picture'
import { ChangeProfilePictureService } from '@/data/services'
import { makeAwsS3FileStorage } from '@/main/factories/file-storage'
import { makeUniqueId } from '@/main/factories/crypto'
import { makePrismaProfileRepository } from '@/main/factories/repositories'

export const makeChangeProfilePicture = (): ChangeProfilePicture => {
  return new ChangeProfilePictureService(
    makeAwsS3FileStorage(),
    makeUniqueId(),
    makePrismaProfileRepository()
  )
}

import { DeletePictureController } from '@/application/controllers/profile'
import { makeChangeProfilePicture } from '@/main/factories/services'

export const makeDeletePictureController = (): DeletePictureController => {
  const changeProfilePicture = makeChangeProfilePicture()
  return new DeletePictureController(changeProfilePicture)
}

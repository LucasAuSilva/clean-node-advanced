import { SavePictureController } from '@/application/controllers/profile'
import { makeChangeProfilePicture } from '@/main/factories/services'

export const makeSavePictureController = (): SavePictureController => {
  const changeProfilePicture = makeChangeProfilePicture()
  return new SavePictureController(changeProfilePicture)
}

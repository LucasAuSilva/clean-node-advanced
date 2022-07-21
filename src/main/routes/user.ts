import { auth } from '@/main/middlewares'
import { adaptExpressRoute, adaptMulter as upload } from '@/main/adapters'
import { makeSavePictureController } from '@/main/factories/controllers'

import { Router } from 'express'

export default (router: Router): void => {
  router.delete('/users/picture', auth, adaptExpressRoute(makeSavePictureController()))
  router.put('/users/picture', auth, upload, adaptExpressRoute(makeSavePictureController()))
}

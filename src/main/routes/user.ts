import { auth } from '@/main/middlewares'
import { adaptExpressRoute } from '@/main/adapters'
import { makeDeletePictureController } from '@/main/factories/controllers'

import { Router } from 'express'

export default (router: Router): void => {
  router.delete('/users/picture', auth, adaptExpressRoute(makeDeletePictureController()))
}

import { adaptExpressMiddleware } from '@/main/adapters/express-middleware'
import { makeAuthenticationMiddleware } from '@/main/factories/middlewares'

export const auth = adaptExpressMiddleware(makeAuthenticationMiddleware())

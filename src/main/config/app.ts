import { setupRoutes } from './routes'
import { setupMiddlewares } from './middlewares'

import express, { Express } from 'express'

export const setupApp = async (): Promise<Express> => {
  const app = express()
  setupMiddlewares(app)
  await setupRoutes(app)
  return app
}

import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

export const setupRoutes = async (app: Express): Promise<void> => {
  const router = Router()
  const files = readdirSync(join(__dirname, '../routes'))
    .filter(file => !file.endsWith('.map'))
  for await (const file of files) {
    (await import(`../routes/${file}`)).default(router)
  }
  app.use(router)
}

import { env } from '@/main/config/env'
import { setupApp } from '@/main/config/app'
import { PrismaHelper } from '@/tests/infra/prisma/helpers'

import request from 'supertest'
import { sign } from 'jsonwebtoken'

describe('User Routes', () => {
  describe('DELETE /users/picture', () => {
    afterAll(async () => {
      await PrismaHelper.disconnect()
    })

    afterEach(async () => {
      const prisma = await PrismaHelper.connect()
      await prisma.account.deleteMany({})
      await PrismaHelper.disconnect()
    })

    it('should return 403 if no authorization header is provided', async () => {
      const app = await setupApp()
      const { status } = await request(app)
        .delete('/api/users/picture')
        .send({})

      expect(status).toBe(403)
    })

    it('should return 204', async () => {
      const prisma = await PrismaHelper.connect()
      const { id } = await prisma.account.create({ data: { email: 'any_email' } })
      const authorization = sign({ key: id }, env.jwtSecret)
      const app = await setupApp()

      const { status, body } = await request(app)
        .delete('/api/users/picture')
        .set({ authorization })
        .send({})

      expect(status).toBe(204)
      expect(body).toEqual({})
    })
  })
})

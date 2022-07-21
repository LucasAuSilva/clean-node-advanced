import { setupApp } from '@/main/config/app'
import { PrismaHelper } from '@/tests/infra/prisma/helpers'

import request from 'supertest'

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
  })
})

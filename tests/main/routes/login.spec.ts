import { UnauthorizedError } from '@/application/errors'
import { setupApp } from '@/main/config/app'
import { PrismaHelper } from '@/tests/infra/prisma/helpers'

import request from 'supertest'

describe('Login Routes', () => {
  describe('POST /login/facebook', () => {
    const loadUserSpy = jest.fn()
    jest.mock('@/infra/apis/facebook', () => ({
      FacebookApi: jest.fn().mockReturnValue({ loadUser: loadUserSpy })
    }))

    afterAll(async () => {
      await PrismaHelper.disconnect()
    })

    afterEach(async () => {
      const prisma = await PrismaHelper.connect()
      await prisma.account.deleteMany({})
      await PrismaHelper.disconnect()
    })

    it('should return 200 with AccessToken', async () => {
      loadUserSpy.mockResolvedValueOnce({ facebookId: 'any_id', name: 'any_name', email: 'any_email' })
      const app = await setupApp()

      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(status).toBe(200)
      expect(body.accessToken).toBeDefined()
    })

    it('should return 401 with UnauthorizedError', async () => {
      const app = await setupApp()

      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'invalid_token' })

      expect(status).toBe(401)
      expect(body).toEqual({ error: new UnauthorizedError().message })
    })
  })
})

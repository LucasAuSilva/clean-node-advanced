import { ForbiddenError } from '@/application/errors'
import { setupApp } from '@/main/config/app'
import { auth } from '@/main/middlewares'

import request from 'supertest'

describe('Authentication Middleware', () => {
  it('should return 403 if authorization header was not provided', async () => {
    const app = await setupApp()
    app.get('/fake_route', auth)
    const { status, body } = await request(app)
      .get('/fake_route')

    expect(status).toBe(403)
    expect(body.error).toBe(new ForbiddenError().message)
  })
})

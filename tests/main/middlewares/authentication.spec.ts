import { ForbiddenError } from '@/application/errors'
import { setupApp } from '@/main/config/app'
import { auth } from '@/main/middlewares'
import { env } from '@/main/config/env'

import request from 'supertest'
import { sign } from 'jsonwebtoken'

describe('Authentication Middleware', () => {
  it('should return 403 if authorization header was not provided', async () => {
    const app = await setupApp()
    app.get('/fake_route', auth)
    const { status, body } = await request(app)
      .get('/fake_route')

    expect(status).toBe(403)
    expect(body.error).toBe(new ForbiddenError().message)
  })

  it('should return 200 if authorization header is valid', async () => {
    const app = await setupApp()
    const authorization = sign({ key: 'any_user_id' }, env.jwtSecret)
    app.get('/fake_route', auth, (req, res) => {
      res.status(200).json(req.locals)
    })
    const { status, body } = await request(app)
      .get('/fake_route')
      .set({ authorization })

    expect(status).toBe(200)
    expect(body).toEqual({ userId: 'any_user_id' })
  })
})

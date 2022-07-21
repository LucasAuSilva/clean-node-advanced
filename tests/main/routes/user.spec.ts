import { env } from '@/main/config/env'
import { setupApp } from '@/main/config/app'
import { PrismaHelper } from '@/tests/infra/prisma/helpers'

import request from 'supertest'
import { sign } from 'jsonwebtoken'

describe('User Routes', () => {
  afterAll(async () => {
    await PrismaHelper.disconnect()
  })

  afterEach(async () => {
    const prisma = await PrismaHelper.connect()
    await prisma.account.deleteMany({})
    await PrismaHelper.disconnect()
  })
  describe('DELETE /users/picture', () => {
    it('should return 403 if no authorization header is provided', async () => {
      const app = await setupApp()
      const { status } = await request(app)
        .delete('/api/users/picture')
        .send({})

      expect(status).toBe(403)
    })

    it('should return 200 with valid data', async () => {
      const prisma = await PrismaHelper.connect()
      const { id } = await prisma.account.create({ data: { email: 'any_email', name: 'Lucas augusto' } })
      const authorization = sign({ key: id }, env.jwtSecret)
      const app = await setupApp()

      const { status, body } = await request(app)
        .delete('/api/users/picture')
        .set({ authorization })
        .send({})

      expect(status).toBe(200)
      expect(body).toEqual({ pictureUrl: undefined, initials: 'LA' })
    })
  })

  describe('PUT /users/picture', () => {
    const uploadSpy = jest.fn()
    jest.mock('@/infra/file-storage/aws-s3', () => ({
      AwsS3FileStorage: jest.fn().mockReturnValue({ upload: uploadSpy })
    }))

    it('should return 403 if no authorization header is provided', async () => {
      const app = await setupApp()
      const { status } = await request(app)
        .put('/api/users/picture')
        .send({})

      expect(status).toBe(403)
    })

    it('should return 200 with valid data', async () => {
      uploadSpy.mockResolvedValueOnce('any_url')
      const prisma = await PrismaHelper.connect()
      const { id } = await prisma.account.create({ data: { email: 'any_email', name: 'Lucas augusto' } })
      const authorization = sign({ key: id }, env.jwtSecret)
      const app = await setupApp()

      const { status, body } = await request(app)
        .put('/api/users/picture')
        .set({ authorization })
        .attach('file', Buffer.from('any_buffer'), { filename: 'any_name', contentType: 'image/png' })

      expect(status).toBe(200)
      expect(body).toEqual({ pictureUrl: 'any_url', initials: undefined })
    })
  })
})

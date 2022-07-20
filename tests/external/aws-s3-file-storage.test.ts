import { AwsS3FileStorage } from '@/infra/file-storage'
import { env } from '@/main/config/env'

import axios from 'axios'

type SutTypes = {
  sut: AwsS3FileStorage
}

const makeSut = (): SutTypes => {
  const sut = new AwsS3FileStorage(
    env.s3.accessKey,
    env.s3.secret,
    env.s3.bucket
  )
  return {
    sut
  }
}

describe('Aws S3 Integration Test', () => {
  it('should upload and delete image from aws s3', async () => {
    const onePixelImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjWFJ78z8ABr0C+g1yhF4AAAAASUVORK5CYII='
    const file = Buffer.from(onePixelImage, 'base64')
    const { sut } = makeSut()
    const key = 'any_key.png'

    const pictureUrl = await sut.upload(file, key)
    expect((await axios.get(pictureUrl)).status).toBe(200)

    await sut.delete(key)

    await expect(axios.get(pictureUrl)).rejects.toThrow()
  })
})

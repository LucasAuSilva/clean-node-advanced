import { UploadFile } from '@/data/contracts/file-storage'
import { config, S3 } from 'aws-sdk'

jest.mock('aws-sdk')

class AwsS3FileStorage implements UploadFile {
  constructor (
    accessKey: string, secret: string,
    private readonly bucket: string
  ) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
  }

  async upload (file: Buffer, key: string): Promise<string> {
    const s3 = new S3()
    await s3.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    }).promise()
    return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`
  }
}

const accessKey = 'any_access_key'
const secret = 'any_secret'
const bucket = 'any_bucket'
const key = 'any_key'
const file = Buffer.from('any_buffer')

const makeSut = (): AwsS3FileStorage => {
  return new AwsS3FileStorage(accessKey, secret, bucket)
}

describe('AWS S3 File Storage', () => {
  let putObjectSpy: jest.Mock
  let putObjectPromiseSpy: jest.Mock

  beforeAll(() => {
    putObjectPromiseSpy = jest.fn()
    putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
    jest.mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({
      putObject: putObjectSpy
    })))
  })

  it('should config aws credentials on creation', () => {
    const sut = makeSut()

    expect(sut).toBeDefined()
    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
    expect(config.update).toHaveBeenCalledTimes(1)
  })

  it('should call put object with correct input', async () => {
    const sut = makeSut()
    await sut.upload(file, key)
    expect(putObjectSpy).toHaveBeenCalledWith({
      Bucket: bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    })
    expect(putObjectSpy).toHaveBeenCalledTimes(1)
    expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
  })

  it('should return imageUrl', async () => {
    const sut = makeSut()
    const imageUrl = await sut.upload(file, key)
    expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/${key}`)
  })

  it('should return encoded imageUrl', async () => {
    const sut = makeSut()
    const imageUrl = await sut.upload(file, 'any key')
    expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/any%20key`)
  })
})

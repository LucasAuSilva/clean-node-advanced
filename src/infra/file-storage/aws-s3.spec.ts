import { config, S3 } from 'aws-sdk'

jest.mock('aws-sdk')

class AwsS3FileStorage {
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

  async upload (key: string, file: Buffer): Promise<void> {
    const s3 = new S3()
    await s3.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    }).promise()
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
    await sut.upload(key, file)
    expect(putObjectSpy).toHaveBeenCalledWith({
      Bucket: bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    })
    expect(putObjectSpy).toHaveBeenCalledTimes(1)
    expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
  })
})

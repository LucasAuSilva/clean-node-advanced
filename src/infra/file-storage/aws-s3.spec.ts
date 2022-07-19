import { config } from 'aws-sdk'

jest.mock('aws-sdk')

class AwsS3FileStorage {
  constructor (private readonly accessKey: string, private readonly secret: string) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
  }
}

const accessKey = 'any_access_key'
const secret = 'any_secret'

const makeSut = (): AwsS3FileStorage => {
  return new AwsS3FileStorage(accessKey, secret)
}

describe('AWS S3 File Storage', () => {
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
})

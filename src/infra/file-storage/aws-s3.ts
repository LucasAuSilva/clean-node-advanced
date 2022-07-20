import { UploadFile } from '@/data/contracts/file-storage'

import { config, S3 } from 'aws-sdk'

export class AwsS3FileStorage implements UploadFile {
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

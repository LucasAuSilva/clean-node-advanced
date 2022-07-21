import { DeleteFile, UploadFile } from '@/data/contracts/file-storage'

import { config, S3 } from 'aws-sdk'

export class AwsS3FileStorage implements UploadFile, DeleteFile {
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

  async upload (file: Buffer, fileName: string): Promise<string> {
    const s3 = new S3()
    await s3.putObject({
      Bucket: this.bucket,
      Key: fileName,
      Body: file,
      ACL: 'public-read'
    }).promise()
    return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(fileName)}`
  }

  async delete (fileName: string): Promise<void> {
    const s3 = new S3()
    await s3.deleteObject({
      Bucket: this.bucket,
      Key: fileName
    }).promise()
  }
}

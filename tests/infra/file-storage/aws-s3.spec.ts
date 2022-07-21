import { AwsS3FileStorage } from '@/infra/file-storage'

import { config, S3 } from 'aws-sdk'

jest.mock('aws-sdk')

const accessKey = 'any_access_key'
const secret = 'any_secret'
const bucket = 'any_bucket'

const makeSut = (): AwsS3FileStorage => {
  return new AwsS3FileStorage(accessKey, secret, bucket)
}

describe('AWS S3 File Storage', () => {
  const fileName = 'any_file_name'

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

  describe('upload()', () => {
    let putObjectSpy: jest.Mock
    let putObjectPromiseSpy: jest.Mock
    let file: Buffer

    beforeAll(() => {
      putObjectPromiseSpy = jest.fn()
      putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
      jest.mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({
        putObject: putObjectSpy
      })))
      file = Buffer.from('any_buffer')
    })

    it('should call put object with correct input', async () => {
      const sut = makeSut()
      await sut.upload(file, fileName)
      expect(putObjectSpy).toHaveBeenCalledWith({
        Bucket: bucket,
        Key: fileName,
        Body: file,
        ACL: 'public-read'
      })
      expect(putObjectSpy).toHaveBeenCalledTimes(1)
      expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
    })

    it('should return imageUrl', async () => {
      const sut = makeSut()
      const imageUrl = await sut.upload(file, fileName)
      expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/${fileName}`)
    })

    it('should return encoded imageUrl', async () => {
      const sut = makeSut()
      const imageUrl = await sut.upload(file, 'any file name')
      expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/any%20file%20name`)
    })

    it('should rethrow if putObject throws', async () => {
      const error = new Error('upload_error')
      putObjectPromiseSpy.mockRejectedValueOnce(error)
      const sut = makeSut()
      const promise = sut.upload(file, fileName)
      await expect(promise).rejects.toThrow(error)
    })
  })

  describe('delete()', () => {
    let deleteObjectSpy: jest.Mock
    let deleteObjectPromiseSpy: jest.Mock

    beforeAll(() => {
      deleteObjectPromiseSpy = jest.fn()
      deleteObjectSpy = jest.fn().mockImplementation(() => ({ promise: deleteObjectPromiseSpy }))
      jest.mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({
        deleteObject: deleteObjectSpy
      })))
    })

    it('should call deleteObject with correct input', async () => {
      const sut = makeSut()
      await sut.delete(fileName)
      expect(deleteObjectSpy).toHaveBeenCalledWith({
        Bucket: bucket,
        Key: fileName
      })
      expect(deleteObjectSpy).toHaveBeenCalledTimes(1)
      expect(deleteObjectPromiseSpy).toHaveBeenCalledTimes(1)
    })

    it('should rethrow if deleteObject throws', async () => {
      const error = new Error('delete_error')
      deleteObjectPromiseSpy.mockRejectedValueOnce(error)
      const sut = makeSut()
      const promise = sut.delete(fileName)
      await expect(promise).rejects.toThrow(error)
    })
  })
})

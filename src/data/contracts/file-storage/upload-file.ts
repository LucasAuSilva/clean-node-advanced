
export interface UploadFile {
  upload: (file: Buffer, key: string) => Promise<void>
}

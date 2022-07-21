
export interface UploadFile {
  upload: (file: Buffer, fileName: string) => Promise<string>
}

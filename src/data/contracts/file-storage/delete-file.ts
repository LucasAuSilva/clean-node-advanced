export interface DeleteFile {
  delete: (fileName: string) => Promise<void>
}

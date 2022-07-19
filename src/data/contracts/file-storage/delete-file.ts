export interface DeleteFile {
  delete: (key: string) => Promise<void>
}

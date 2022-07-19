export interface LoadProfileById {
  loadById: (id: string) => Promise<void>
}

export interface LoadProfileById {
  loadById: (id: string) => Promise<string | undefined>
}

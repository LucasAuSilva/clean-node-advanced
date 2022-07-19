export interface SaveProfilePicture {
  savePicture: (id: string, pictureUrl?: string, initials?: string) => Promise<void>
}

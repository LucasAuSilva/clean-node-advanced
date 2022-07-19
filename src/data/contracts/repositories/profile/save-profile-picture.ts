export interface SaveProfilePicture {
  savePicture: (pictureUrl?: string, initials?: string) => Promise<void>
}

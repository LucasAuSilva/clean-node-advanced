export interface ChangeProfilePicture {
  perform: (dto: ChangeProfilePictureDto) => Promise<ChangeProfilePictureResult>
}

export type ChangeProfilePictureDto = { id: string, file?: { buffer: Buffer, mimeType: string} }
export type ChangeProfilePictureResult = { pictureUrl?: string, initials?: string }

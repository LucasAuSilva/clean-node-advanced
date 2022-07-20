export interface ChangeProfilePicture {
  perform: (dto: ChangeProfilePictureDto) => Promise<ChangeProfilePictureResult>
}

export type ChangeProfilePictureDto = { id: string, file?: Buffer }
export type ChangeProfilePictureResult = { pictureUrl?: string, initials?: string }

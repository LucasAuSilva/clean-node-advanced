/* eslint-disable @typescript-eslint/no-non-null-assertion */

export class Profile {
  initials?: string
  pictureUrl?: string

  constructor (
    readonly id: string
  ) {}

  setPicture (pictureUrl?: string, name?: string): void {
    this.pictureUrl = pictureUrl
    if (pictureUrl === undefined && name !== undefined && name.length > 0) {
      const firstLetters = name.toUpperCase().match(/\b(.)/g)!
      if (firstLetters.length > 1) {
        this.initials = `${firstLetters.shift()!}${firstLetters.pop()!}`
      } else {
        this.initials = name.substring(0, 2).toUpperCase()!
      }
    }
  }
}

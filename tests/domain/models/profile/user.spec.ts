import { Profile } from '@/domain/models/profile'

describe('Profile', () => {
  const id = 'any_id'
  let sut: Profile

  beforeEach(() => {
    sut = new Profile(id)
  })

  it('should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture('any_url', 'any_name')
    expect(sut).toEqual({
      id,
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  it('should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture('any_url')
    expect(sut).toEqual({
      id,
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  it('should create initials with first letter of first and last names', () => {
    sut.setPicture(undefined, 'lucas augusto da silva')
    expect(sut).toEqual({
      id,
      pictureUrl: undefined,
      initials: 'LS'
    })
  })

  it('should create initials with first two letters of first names', () => {
    sut.setPicture(undefined, 'lucas')
    expect(sut).toEqual({
      id,
      pictureUrl: undefined,
      initials: 'LU'
    })
  })

  it('should create initials with first letter', () => {
    sut.setPicture(undefined, 'l')
    expect(sut).toEqual({
      id,
      pictureUrl: undefined,
      initials: 'L'
    })
  })

  it('should create empty initials when name and picture url are not provided', () => {
    sut.setPicture()
    expect(sut).toEqual({
      id,
      pictureUrl: undefined,
      initials: undefined
    })
  })

  it('should create empty initials when name and picture url are not provided', () => {
    sut.setPicture(undefined, '')
    expect(sut).toEqual({
      id,
      pictureUrl: undefined,
      initials: undefined
    })
  })
})

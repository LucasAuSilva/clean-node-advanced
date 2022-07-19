import { UniqueId } from '@/infra/crypto'

describe('Unique ID', () => {
  it('should call uuid.v4', () => {
    const sut = new UniqueId(new Date(2022, 9, 3, 10, 10, 10))
    const uuid = sut.generate('any_key')
    expect(uuid).toBe('any_key_20221003101010')
  })

  it('should call uuid.v4', () => {
    const sut = new UniqueId(new Date(2015, 2, 10, 18, 1, 0))
    const uuid = sut.generate('any_key')
    expect(uuid).toBe('any_key_20150310180100')
  })
})

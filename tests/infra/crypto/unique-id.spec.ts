
class UniqueId {
  constructor (
    private readonly date: Date
  ) {}

  generate (key: string): string {
    return key +
      '_' +
      this.date.getFullYear().toString() +
      (this.date.getMonth() + 1).toString().padStart(2, '0') +
      this.date.getDate().toString().padStart(2, '0') +
      this.date.getHours().toString().padStart(2, '0') +
      this.date.getMinutes().toString().padStart(2, '0') +
      this.date.getSeconds().toString().padStart(2, '0')
  }
}

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

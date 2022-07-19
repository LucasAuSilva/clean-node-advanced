import { UUIDGenerator } from '@/data/contracts/crypto'

export class UniqueId implements UUIDGenerator {
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

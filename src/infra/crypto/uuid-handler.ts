import { v4 } from 'uuid'
import { UUIDGenerator } from '@/data/contracts/crypto'

export class UUIDHandler implements UUIDGenerator {
  generate (key: string): string {
    return `${key}_${v4()}`
  }
}

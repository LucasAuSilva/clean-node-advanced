import { UUIDHandler } from '@/infra/crypto'

export const makeUuid = (): UUIDHandler => {
  return new UUIDHandler()
}

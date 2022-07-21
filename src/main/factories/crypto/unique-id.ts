import { UniqueId } from '@/infra/crypto'

export const makeUniqueId = (): UniqueId => {
  return new UniqueId(new Date())
}

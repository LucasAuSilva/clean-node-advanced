import { FacebookAuthService } from '@/data/services'
import { makeFacebookApi } from '@/main/factories/apis'
import { makeJwtTokenHandler } from '@/main/factories/crypto'
import { makePrismaAccountRepository } from '@/main/factories/repositories'

export const makeFacebookAuthService = (): FacebookAuthService => {
  const fbApi = makeFacebookApi()
  const crypto = makeJwtTokenHandler()
  const prismaAccountRepo = makePrismaAccountRepository()
  return new FacebookAuthService(fbApi, prismaAccountRepo, crypto)
}

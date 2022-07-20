import { ChangeProfilePicture } from '@/domain/features/change-profile-picture'
import { Controller } from '@/application/controllers'
import { HttpResponse, noContent } from '@/application/helpers'
import { mock, MockProxy } from 'jest-mock-extended'

type HttpRequest = { userId: string }

class DeletePictureController extends Controller {
  constructor (
    private readonly changeProfilePicture: ChangeProfilePicture
  ) { super() }

  async perform ({ userId }: HttpRequest): Promise<HttpResponse> {
    await this.changeProfilePicture.perform({ id: userId })
    return noContent()
  }
}

type SutTypes = {
  sut: DeletePictureController
  changeProfilePicture: MockProxy<ChangeProfilePicture>
}

const makeSut = (): SutTypes => {
  const changeProfilePicture = mock<ChangeProfilePicture>()
  const sut = new DeletePictureController(changeProfilePicture)
  return {
    sut,
    changeProfilePicture
  }
}

describe('DeletePicture Controller', () => {
  it('should extends Controller', () => {
    const { sut } = makeSut()
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should call ChangeProfilePicture with correct input', async () => {
    const { sut, changeProfilePicture } = makeSut()

    await sut.handle({ userId: 'any_user_id' })

    expect(changeProfilePicture.perform).toHaveBeenCalledWith({ id: 'any_user_id' })
    expect(changeProfilePicture.perform).toHaveBeenCalledTimes(1)
  })

  it('should return 204', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({ userId: 'any_user_id' })

    expect(httpResponse).toEqual({
      statusCode: 204,
      data: null
    })
  })
})

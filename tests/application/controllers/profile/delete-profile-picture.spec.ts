import { ChangeProfilePicture } from '@/domain/features/change-profile-picture'
import { mock } from 'jest-mock-extended'

type HttpRequest = { userId: string }

class DeletePictureController {
  constructor (
    private readonly changeProfilePicture: ChangeProfilePicture
  ) {}

  async handle ({ userId }: HttpRequest): Promise<void> {
    await this.changeProfilePicture.perform({ id: userId })
  }
}

describe('DeletePicture Controller', () => {
  it('should call ChangeProfilePicture with correct input', async () => {
    const changeProfilePicture = mock<ChangeProfilePicture>()
    const sut = new DeletePictureController(changeProfilePicture)

    await sut.handle({ userId: 'any_user_id' })

    expect(changeProfilePicture.perform).toHaveBeenCalledWith({ id: 'any_user_id' })
    expect(changeProfilePicture.perform).toHaveBeenCalledTimes(1)
  })
})

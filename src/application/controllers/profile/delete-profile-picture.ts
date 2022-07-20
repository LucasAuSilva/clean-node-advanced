import { ChangeProfilePicture } from '@/domain/features/change-profile-picture'
import { Controller } from '@/application/controllers'
import { HttpResponse, noContent } from '@/application/helpers'

export class DeletePictureController extends Controller {
  constructor (
    private readonly changeProfilePicture: ChangeProfilePicture
  ) { super() }

  override async perform ({ userId }: HttpRequest): Promise<HttpResponse> {
    await this.changeProfilePicture.perform({ id: userId })
    return noContent()
  }
}

type HttpRequest = { userId: string }

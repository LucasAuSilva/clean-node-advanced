export interface HttpGetClient {
  get: (dto: HttpGetClientDto) => Promise<void>
}

export type HttpGetClientDto = {
  url: string
  params: object
}

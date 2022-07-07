export interface HttpGetClient {
  get: <T = any> (dto: HttpGetClientDto) => Promise<T>
}

export type HttpGetClientDto = {
  url: string
  params: object
}

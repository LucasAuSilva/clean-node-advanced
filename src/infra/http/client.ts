export interface HttpGetClient {
  get: (dto: HttpGetClientDto) => Promise<HttpClientGetResult>
}

export type HttpGetClientDto = {
  url: string
  params: object
}

type HttpClientGetResult = any

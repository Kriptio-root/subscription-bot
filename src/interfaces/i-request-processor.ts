export interface IRequestProcessor {
  fetchDataRequest: (
    formatedEndpoint: string
  ) => Promise<string>
}

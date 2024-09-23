import type { IUserCoordinates } from './i-user-coordinates'

export interface IApiEndpointComposer {
  compose: (userCoordinates: IUserCoordinates) => string
}

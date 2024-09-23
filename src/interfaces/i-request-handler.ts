import type { IUser } from './i-user'
import type { IActiveUserTrackData } from './i-active-user-tack-data'

export interface IRequestHandler {
  handleRequest: (
    user: IActiveUserTrackData | IUser
  ) => Promise<string>
}

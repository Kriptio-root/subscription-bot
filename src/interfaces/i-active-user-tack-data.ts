import type { IState } from './i-state'
import type { IUserCoordinates } from './i-user-coordinates'

export interface IActiveUserTrackData {
  userName: string;
  chatID: number;
  location?: IUserCoordinates;
  notificationTime?: string;
  timer: NodeJS.Timeout;
  state: IState;
  userTimeZone?: string
}

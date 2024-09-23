import type { IUserCoordinates } from './i-user-coordinates'

export interface IUser {
  userName: string;
  chatID: number;
  location: IUserCoordinates;
  notificationTime: string;
  userTimeZone: string
}

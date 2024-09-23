import type { IActiveUserTrackData } from './i-active-user-tack-data'
import type { IUser } from './i-user'

export interface IUserNotificationScheduler {
  scheduleNotifications: () => Promise<void>;
  rescheduleUserNotification: (user: IActiveUserTrackData | IUser) => void;
  cancelUserNotification: (userName: string) => void;
  scheduleUserNotification: (user: IActiveUserTrackData | IUser) => void;
  scheduleUserNotificationForExistingUser: (
    user: IActiveUserTrackData | IUser
  ) => Promise<void>
}

export interface IUserMessageWorkingFields {
  userName?: string;
  chatID?: number;
  command?: string;
  location?: {
    latitude: number;
    longitude: number
  };
  notificationTime?: string;
  timer?: NodeJS.Timeout;
  text?: string
}

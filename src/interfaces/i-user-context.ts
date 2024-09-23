import type TelegramBot from 'node-telegram-bot-api'
import type {
  IActiveUserTrackData,
  IState, IUserMessageWorkingFields
} from '../interfaces'

export interface IUserContext {

  handleInput: (
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ) => Promise<void>;

  transitionTo: (
    state: IState,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ) => Promise<void>;

  setCoordinates: (
    coordinates: TelegramBot.Location,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ) => void;

  setNotificationTime: (
    notificationTime: string,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ) => void;

  getUserData: (
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ) => IActiveUserTrackData | undefined;

  saveSubscription: (
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    data: IActiveUserTrackData
  ) => Promise<void>;

  completeSubscription: (
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ) => Promise<void>;

  sendMessage: (
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    text: string,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    options?: { reply_markup: TelegramBot.ReplyKeyboardMarkup }
  ) => Promise<void>;

  getState: () => IState | undefined;

  getUpdateFields: (
    message: TelegramBot.CallbackQuery |
    TelegramBot.Message
  ) => Promise<IUserMessageWorkingFields>;

  updateUserNotificationTime: (
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    data: IActiveUserTrackData
  ) => Promise<void>;

  updateUserLocation: (
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    data: IActiveUserTrackData
  ) => Promise<void>;

  completeUserUpdate: (
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ) => void
}

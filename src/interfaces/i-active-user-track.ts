import type TelegramBot from 'node-telegram-bot-api'
import type { IActiveUserTrackData } from './i-active-user-tack-data'
import type { IState } from './i-state'
import type { IUserCoordinates } from './i-user-coordinates'

export interface IActiveUserTrack {
  setActiveUserTrack: (
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    state: IState
  ) => Promise<void>;

  getActiveUserTrack: (
    userName: string,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ) => IActiveUserTrackData | undefined;

  deleteActiveUserTrack: (
    userName: string,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ) => void;

  setUserState: (
    userName: string,
    state: IState,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ) => Promise<void>;

  setUserTimeZone: (
    userName: string,
    userLocation: IUserCoordinates,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ) => void;

  resetTrackDownTimer: (
    userName: string,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ) => void
}

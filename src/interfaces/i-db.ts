import type { PrismaClient } from '@prisma/client'
import type TelegramBot from 'node-telegram-bot-api'
import type { IActiveUserTrackData } from './i-active-user-tack-data'
import type { IUser } from './i-user'

export interface IDB {
  connect: () => Promise<void>;

  disconnect: () => Promise<void>;

  getClient: () => PrismaClient;

  subscribe: (
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    data: IActiveUserTrackData) => Promise<void>;

  getSubscription: (
    userName: string,
    message?: TelegramBot.CallbackQuery | TelegramBot.Message,
  ) => Promise<IUser | undefined>;

  unsubscribe: (
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    userName: string
  ) => Promise<void>;

  getAllUserNames: () => Promise<string[]>;

  getAllUsers: () => Promise<IUser[]>;

  updateUserLocation: (
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    data: IActiveUserTrackData
  ) => Promise<void>;

  updateUserTime: (
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    data: IActiveUserTrackData
  ) => Promise<void>
}

import type TelegramBot from 'node-telegram-bot-api'

export interface IUserListCache {
  addUser: (
    message: TelegramBot.CallbackQuery |
    TelegramBot.Message
  ) => Promise<void>;
  deleteUser: (
    message: TelegramBot.CallbackQuery |
    TelegramBot.Message
  ) => Promise<void>;
  hasUser: (
    message: TelegramBot.CallbackQuery |
    TelegramBot.Message
  ) => Promise<boolean>;
  initializeCache: () => Promise<void>;
  stopCacheTimer: () => void
}

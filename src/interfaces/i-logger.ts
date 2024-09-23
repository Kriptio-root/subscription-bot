import type TelegramBot from 'node-telegram-bot-api'

export interface ILogger {
  info: (...args: unknown[]) => void;
  tracedInfo: (
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    ...args: unknown[]
  ) => void;
  tracedError: (
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    ...args: unknown[]
  ) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void
}

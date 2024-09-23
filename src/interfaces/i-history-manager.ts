import type TelegramBot from 'node-telegram-bot-api'

export interface IHistoryManager {
  recordMessage: (
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
  ) => void
}

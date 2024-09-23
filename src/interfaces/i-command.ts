import type TelegramBot from 'node-telegram-bot-api'
import type { IUserMessageWorkingFields } from './i-user-message-working-fields'

export interface ICommand {
  execute: (
    workingFields: IUserMessageWorkingFields,
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
  ) => void
}

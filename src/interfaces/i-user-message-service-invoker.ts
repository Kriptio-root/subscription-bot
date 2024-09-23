import type TelegramBot from 'node-telegram-bot-api'
import type { IUserMessageWorkingFields } from './index'

export interface IUserMessageServiceInvoker {
  execute: (
    workingFields: IUserMessageWorkingFields,
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
  ) => Promise<void>
}

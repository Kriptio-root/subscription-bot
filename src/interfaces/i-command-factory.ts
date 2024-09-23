import type TelegramBot from 'node-telegram-bot-api'
import type { AbstractUserCommand } from '../abstract'
import type { IUserMessageWorkingFields } from './i-user-message-working-fields'

export interface ICommandFactory {
  getConcreteCommand: (
    workingFields: IUserMessageWorkingFields,
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
  ) => AbstractUserCommand
}

import type TelegramBot from 'node-telegram-bot-api'
import type { IHandler } from './i-handler'
import type { IUserMessageWorkingFields } from './i-user-message-working-fields'

export interface IMessageFieldsHandler extends IHandler<
TelegramBot.CallbackQuery | TelegramBot.Message,
Promise<IUserMessageWorkingFields>
> {
  setNext: (handler: IMessageFieldsHandler) => IMessageFieldsHandler;

  handle: (
    request: TelegramBot.CallbackQuery | TelegramBot.Message,
    fields?: IUserMessageWorkingFields
  ) => Promise<IUserMessageWorkingFields>
}

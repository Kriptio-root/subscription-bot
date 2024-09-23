import type TelegramBot from 'node-telegram-bot-api'
import type { IUserContext } from '../interfaces'

export interface IState {
  setContext: (context: IUserContext) => void;
  handleInput: (
    message: TelegramBot.CallbackQuery |
    TelegramBot.Message
  ) => Promise<void>
}

import type { InlineKeyboardButton } from 'node-telegram-bot-api'
import type TelegramBot from 'node-telegram-bot-api'

export interface IKeyboardInlineButtonsCreator {
  createButtons: ((
    button: TelegramBot.InlineKeyboardButton[]
  ) => InlineKeyboardButton[][]) ;

  getButtons: () => InlineKeyboardButton[][];

  clearButtons: () => void
}

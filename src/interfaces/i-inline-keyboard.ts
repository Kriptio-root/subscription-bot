import type {
  InlineKeyboardButton,
  InlineKeyboardMarkup
} from 'node-telegram-bot-api'

export interface IInlineKeyboard {
  inlineKeyboardMarkup: InlineKeyboardMarkup | undefined;
  getInlineKeyboard: () => InlineKeyboardMarkup;
  initializeInlineKeyboard: (
    buttons: InlineKeyboardButton[][]
  ) => void
}

import type {
  InlineKeyboardButton,
  KeyboardButton,
  ReplyKeyboardMarkup,
  InlineKeyboardMarkup
} from 'node-telegram-bot-api'

export interface IKeyboardCreator {
  createReplyKeyboard: (button: KeyboardButton) => void;
  getReplyKeyboard: () => ReplyKeyboardMarkup;
  createInlineKeyboard: (button: InlineKeyboardButton[]) => void;
  getInlineKeyboard: () => InlineKeyboardMarkup;
  clearReplyKeyboard: () => void;
  clearInlineKeyboard: () => void
}

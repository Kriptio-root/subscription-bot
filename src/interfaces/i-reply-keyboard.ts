import type { ReplyKeyboardMarkup, KeyboardButton } from 'node-telegram-bot-api'

export interface IReplyKeyboard {
  replyKeyboardMarkup: ReplyKeyboardMarkup | undefined;
  getReplyKeyboard: () => ReplyKeyboardMarkup;
  initializeKeyboard: (buttons: KeyboardButton[][]) => void
}

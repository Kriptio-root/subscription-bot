import type TelegramBot from 'node-telegram-bot-api'

export interface IBotAdapter {
  getBot: () => TelegramBot
}

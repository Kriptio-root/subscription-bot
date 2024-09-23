import type TelegramBot from 'node-telegram-bot-api'

export interface IBotService {
  initialize: () => Promise<void>;
  getBot: () => TelegramBot
}

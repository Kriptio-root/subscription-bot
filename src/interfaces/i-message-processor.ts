import type { Message, CallbackQuery } from 'node-telegram-bot-api'

export interface IMessageProcessor {
  processMessage: (message: CallbackQuery | Message) => Promise<void>
}

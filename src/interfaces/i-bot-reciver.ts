import type TelegramBot from 'node-telegram-bot-api'

export interface IBotReceiver {
  sendMessage: (
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    chatId: number | string,
    text: string,
    options?: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      reply_markup: TelegramBot.InlineKeyboardMarkup |
      TelegramBot.ReplyKeyboardMarkup
    }
  ) => Promise<TelegramBot.Message>;

  sendNotification: (
    chatId: number | string,
    text: string
  ) => Promise<TelegramBot.Message>
}

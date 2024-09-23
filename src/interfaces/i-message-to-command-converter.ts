import type TelegramBot from 'node-telegram-bot-api'

export interface IMessageToCommandConverter {
  convertMessageToCommand: (
    messageToConvert: TelegramBot.CallbackQuery | TelegramBot.Message,
  ) => string;
  getLastConvertedCommand: () => string
}

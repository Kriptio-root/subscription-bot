import { injectable, inject } from 'inversify'
import type TelegramBot from 'node-telegram-bot-api'
import { IBotAdapter, IBotReceiver, type ILogger } from '../../interfaces'
import 'reflect-metadata'
import { SERVICE_IDENTIFIER } from '../../types/identifiers'
import runtimeInformation from '../../types/utilities/runtime-information'

@injectable()
export class BotReceiver implements IBotReceiver {
  private readonly bot: TelegramBot

  public constructor(
  @inject(SERVICE_IDENTIFIER.IBotAdapter)
    botAdapter: IBotAdapter,
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger
  ) {
    this.bot = botAdapter.getBot()
  }

  public async sendMessage(
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    chatId: number | string,
    text: string,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    options?: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      reply_markup: TelegramBot.InlineKeyboardMarkup |
      TelegramBot.ReplyKeyboardMarkup
    }
  ): Promise<TelegramBot.Message> {
    this.logger.tracedInfo(message, runtimeInformation.SENDING_MESSAGE)
    return this.bot.sendMessage(chatId, text, options)
  }

  public async sendNotification(
    chatId: number | string,
    text: string
  ): Promise<TelegramBot.Message> {
    this.logger.info(runtimeInformation.SENDING_NOTIFICATION)
    return this.bot.sendMessage(chatId, text)
  }
}

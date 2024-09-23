import { inject, injectable } from 'inversify'
import TelegramBot from 'node-telegram-bot-api'
import type { IBotAdapter, ILogger } from '../../../interfaces'
import botInitializationOptions from '../../../types/bot/bot-initialization-options'
import ErrorMessages from '../../../types/errors/error-messages'
import { SERVICE_IDENTIFIER } from '../../../types/identifiers'
import { ErrorWithoutAdditionalHandling } from '../../errors/error-without-additional-handling'
import runtimeInformation from '../../../types/utilities/runtime-information'

@injectable()
export class BotAdapter implements IBotAdapter {
  private readonly bot: TelegramBot

  public constructor(
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    private readonly errorWithoutAdditionalHandling:
    ErrorWithoutAdditionalHandling
  ) {
    this.bot = this.createTelegramBot()
  }

  public getBot(): TelegramBot {
    return this.bot
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  private getTelegramToken(): string {
    const token: string | undefined = process.env.TELEGRAM_TOKEN
    if (!token) {
      this.logger.error(
        ErrorMessages.TOKEN_NOT_SET,
        ErrorMessages.FAILED_SPAWN_BOT
      )
      return this.errorWithoutAdditionalHandling.throw(
        ErrorMessages.TOKEN_NOT_SET,
        ErrorMessages.FAILED_SPAWN_BOT
      )
    }
    return token
  }

  private createTelegramBot(): TelegramBot {
    this.logger.info(runtimeInformation.CREATING_BOT)
    const token: string = this.getTelegramToken()
    this.logger.info(runtimeInformation.DONE)
    return new TelegramBot(token, botInitializationOptions.POLLING)
  }
}

import type TelegramBot from 'node-telegram-bot-api'

import { inject, injectable } from 'inversify'
import type {
  IBotAdapter,
  IBotCommandsInitializer,
  ILogger
} from '../../interfaces'
import botCommands from '../../types/bot/bot-commands'
import errorMessages from '../../types/errors/error-messages'
import { SERVICE_IDENTIFIER } from '../../types/identifiers'
import { ErrorWithoutAdditionalHandling } from '../errors'
import 'reflect-metadata'
import runtimeInformation from '../../types/utilities/runtime-information'

@injectable()
export class BotCommandsInitializer implements IBotCommandsInitializer {
  private readonly bot: TelegramBot

  public constructor(
  @inject(SERVICE_IDENTIFIER.IBotAdapter)
    botAdapter: IBotAdapter,
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    private readonly errorWithoutAdditionalHandling:
    ErrorWithoutAdditionalHandling
  ) {
    this.bot = botAdapter.getBot()
  }

  public async initializeBotCommands(): Promise<void> {
    try {
      this.logger.info(runtimeInformation.INITIALIZING_BOT_COMMANDS)
      await this.bot.setMyCommands(Object.values(botCommands))
      this.logger.info(runtimeInformation.DONE)
    } catch (error: unknown) {
      this.logger.error(errorMessages.BOT_SERVICE_SET_COMMANDS)
      this.errorWithoutAdditionalHandling.throw(
        errorMessages.BOT_SERVICE_SET_COMMANDS,
        error
      )
    }
  }
}

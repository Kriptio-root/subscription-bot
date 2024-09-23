import type TelegramBot from 'node-telegram-bot-api'
import { injectable, inject } from 'inversify'
import type {
  IBotAdapter,
  IBotEventHandler,
  ILogger,
  IMessageProcessor
} from '../../interfaces'
import errorEvents from '../../types/errors/error-events'
import errorMessages from '../../types/errors/error-messages'
import { SERVICE_IDENTIFIER } from '../../types/identifiers'
import { ErrorWithoutAdditionalHandling } from '../errors'
import 'reflect-metadata'
import runtimeInformation from '../../types/utilities/runtime-information'

@injectable()
export class BotEventHandler implements IBotEventHandler {
  private readonly bot: TelegramBot

  public constructor(
  @inject(SERVICE_IDENTIFIER.IBotAdapter)
    botAdapter: IBotAdapter,
    @inject(SERVICE_IDENTIFIER.PossibleEventsArray)
    private readonly possibleEventsArray: string[],
    @inject(SERVICE_IDENTIFIER.IMessageProcessor)
    private readonly messageProcessor: IMessageProcessor,
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    private readonly errorWithoutAdditionalHandling:
    ErrorWithoutAdditionalHandling
  ) {
    this.bot = botAdapter.getBot()
  }

  public setupEventHandlers(): void {
    this.possibleEventsArray.forEach((eventType: string): void => {
      if (eventType === errorEvents.POLLING_ERROR) {
        this.bot.on(eventType, (error: Error): void => {
          this.logger.error(
            errorMessages.BOT_EVENT_HANDLER_POLLING_ERROR,
            error
          )
          this.errorWithoutAdditionalHandling.throw(
            errorMessages.BOT_EVENT_HANDLER_POLLING_ERROR,
            error
          )
        })
      } else {
        this.bot.on(
          eventType,
          async (
            message: TelegramBot.CallbackQuery | TelegramBot.Message
          ): Promise<void> => {
            try {
              this.logger.tracedInfo(
                message,
                runtimeInformation.GOT_NEW_MESSAGE
              )
              await this.messageProcessor.processMessage(message)
            } catch (error) {
              this.logger.tracedError(
                message,
                errorMessages.BOT_EVENT_HANDLER_SAFE_HANDLER
              )
              this.errorWithoutAdditionalHandling.throw(
                errorMessages.BOT_EVENT_HANDLER_SAFE_HANDLER,
                error
              )
            }
          }
        )
      }
    })
  }
}

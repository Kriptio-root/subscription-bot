import { injectable, inject } from 'inversify'
import TelegramBot from 'node-telegram-bot-api'
import { AbstractAsyncMessageFieldsHandler } from '../../abstract'
import {
  IUserMessageWorkingFields,
  ILogger, IMessageFieldsHandler, IBotReceiver
} from '../../interfaces'
import {
  IErrorWithoutAdditionalHandling
} from '../../interfaces/i-error-without-additional-handling'
import { SERVICE_IDENTIFIER } from '../../types/identifiers'
import errorMessages from '../../types/errors/error-messages'
import runtimeInformation from '../../types/utilities/runtime-information'

@injectable()
export class WorkingFieldsInitializer
  extends AbstractAsyncMessageFieldsHandler
  implements IMessageFieldsHandler {
  public constructor(
  @inject(SERVICE_IDENTIFIER.ILogger) logger: ILogger,
    @inject(SERVICE_IDENTIFIER.UserNameHandler)
    public userNameHandler: IMessageFieldsHandler,
    @inject(SERVICE_IDENTIFIER.ChatIdHandler)
    public chatIdHandler: IMessageFieldsHandler,
    @inject(SERVICE_IDENTIFIER.UserLocationHandler)
    public userLocationHandler: IMessageFieldsHandler,
    @inject(SERVICE_IDENTIFIER.MessageToCommandHandler)
    public messageToCommandConverter: IMessageFieldsHandler,
    @inject(SERVICE_IDENTIFIER.UserTimeHandler)
    public userTimeHandler: IMessageFieldsHandler,
    @inject(SERVICE_IDENTIFIER.IBotReceiver)
    botReceiver: IBotReceiver,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    errorWithoutAdditionalHandling: IErrorWithoutAdditionalHandling
  ) {
    super(
      logger,
      botReceiver,
      errorWithoutAdditionalHandling
    )
    this.setNext(chatIdHandler)
      .setNext(userNameHandler)
      .setNext(messageToCommandConverter)
      .setNext(userLocationHandler)
      .setNext(userTimeHandler)
  }

  public override async handle(
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): Promise<IUserMessageWorkingFields> {
    try {
      this.logger.tracedInfo(
        message,
        runtimeInformation.USER_MESSAGE_HANDLING
      )
      const result = await this.nextHandler!.handle(message)
      return result
    } catch (error) {
      this.logger.error(errorMessages.WORKING_FIELDS, error)
      return this.errorWithoutAdditionalHandling.throw(
        errorMessages.WORKING_FIELDS,
        error
      )
    }
  }
}

import TelegramBot from 'node-telegram-bot-api'
import {
  inject,
  injectable
} from 'inversify'
import {
  IUserMessageWorkingFields,
  ILogger,
  IBotReceiver
} from '../../interfaces'
import {
  IErrorWithoutAdditionalHandling
} from '../../interfaces/i-error-without-additional-handling'
import { IMessageFieldsHandler } from '../../interfaces/i-message-fields-handler'
import { SERVICE_IDENTIFIER } from '../../types/identifiers'
import errorMessages from '../../types/errors/error-messages'

@injectable()
export abstract class AbstractAsyncMessageFieldsHandler
implements IMessageFieldsHandler {
  protected nextHandler?: IMessageFieldsHandler

  public constructor(
    @inject(SERVICE_IDENTIFIER.ILogger)
    protected readonly logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IBotReceiver)
    protected botReceiver: IBotReceiver,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    protected errorWithoutAdditionalHandling: IErrorWithoutAdditionalHandling
  ) {}

  public setNext(handler: IMessageFieldsHandler): IMessageFieldsHandler {
    this.nextHandler = handler
    return handler
  }

  public async handle(
    request: TelegramBot.CallbackQuery | TelegramBot.Message,
    fields?: IUserMessageWorkingFields
  ): Promise<IUserMessageWorkingFields> {
    if (this.nextHandler) {
      return this.nextHandler.handle(request, fields)
    }
    if (!fields) {
      this.errorWithoutAdditionalHandling.throw(
        errorMessages.FIELDS_OBJECT_NOT_INITIALIZED,
        errorMessages.ERROR_IN_MESSAGE_FIELDS_HANDLER
      )
    }
    return fields
  }
}

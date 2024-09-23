import { injectable } from 'inversify'
import TelegramBot from 'node-telegram-bot-api'
import { AbstractAsyncMessageFieldsHandler } from '../../../abstract'
import { IUserMessageWorkingFields } from '../../../interfaces'
import runtimeInformation from '../../../types/utilities/runtime-information'
import errorMessages from '../../../types/errors/error-messages'

@injectable()
export class UserNameHandler extends AbstractAsyncMessageFieldsHandler {
  public override async handle(
    request: TelegramBot.CallbackQuery | TelegramBot.Message,
    fields?: IUserMessageWorkingFields
  ): Promise<IUserMessageWorkingFields> {
    if (!fields) {
      this.errorWithoutAdditionalHandling.throw(
        errorMessages.ERROR_IN_USER_MESSAGE_HANDLER_CHAIN,
        errorMessages.INITIALIZE_OBJECT_FIELDS_FIRST
      )
    }
    const userName = request.from?.first_name
    if (userName) {
      // eslint-disable-next-line no-param-reassign
      fields.userName = userName
      this.logger.tracedInfo(
        request,
        runtimeInformation.CALL_NEXT_HANDLER
      )
    } else {
      this.logger.tracedInfo(
        request,
        runtimeInformation.CAN_NOT_HANDLE_CALL_SUPER
      )
    }

    if (this.nextHandler) {
      return this.nextHandler.handle(request, fields)
    }
    return fields
  }
}

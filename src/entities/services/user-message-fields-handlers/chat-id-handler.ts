import { injectable } from 'inversify'
import TelegramBot from 'node-telegram-bot-api'
import { AbstractAsyncMessageFieldsHandler } from '../../../abstract'
import { IUserMessageWorkingFields } from '../../../interfaces'
import errorMessages from '../../../types/errors/error-messages'
import messageConstants from '../../../types/message/constants'
import runtimeInformation from '../../../types/utilities/runtime-information'

@injectable()
export class ChatIdHandler extends AbstractAsyncMessageFieldsHandler {
  public override async handle(
    request: TelegramBot.CallbackQuery | TelegramBot.Message,
    fields?: IUserMessageWorkingFields
  ): Promise<IUserMessageWorkingFields> {
    let chatID: number | undefined
    this.logger.tracedInfo(
      request,
      runtimeInformation.GETTING_CHAT_ID
    )
    if (messageConstants.CHAT in request) {
      chatID = request.chat.id
    } else if (messageConstants.MESSAGE in request) {
      chatID = request.message?.chat.id
    }
    if (chatID) {
      // eslint-disable-next-line no-param-reassign
      fields = {
        chatID: chatID,
      }
      this.logger.tracedInfo(
        request,
        runtimeInformation.CALL_NEXT_HANDLER
      )
      if (this.nextHandler) {
        return this.nextHandler.handle(request, fields)
      }
      return fields
    }
    return this.errorWithoutAdditionalHandling.throw(
      errorMessages.ERROR_IN_USER_MESSAGE_HANDLER_CHAIN,
      errorMessages.CHAT_ID_NOT_FOUND
    )
  }
}

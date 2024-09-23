import { injectable } from 'inversify'
import TelegramBot from 'node-telegram-bot-api'
import { AbstractAsyncMessageFieldsHandler } from '../../../abstract'
import { IUserMessageWorkingFields } from '../../../interfaces'
import errorMessages from '../../../types/errors/error-messages'
import constants from '../../../types/message/constants'
import userReplies from '../../../types/message/user-replies'
import runtimeInformation from '../../../types/utilities/runtime-information'

@injectable()
export class UserLocationHandler extends AbstractAsyncMessageFieldsHandler {
  public override async handle(
    request: TelegramBot.CallbackQuery | TelegramBot.Message,
    fields?: IUserMessageWorkingFields
  ): Promise<IUserMessageWorkingFields> {
    try {
      if (
        constants.LOCATION in request &&
        request.location?.longitude &&
        request.location.latitude) {
        const location = {
          longitude: request.location.longitude,
          latitude: request.location.latitude,
        }

        if (fields!.chatID) {
          this.logger.tracedInfo(
            request,
            runtimeInformation.CALL_NEXT_HANDLER
          )

          // eslint-disable-next-line no-param-reassign
          fields!.location = location

          await this.botReceiver.sendMessage(
            request,
            fields!.chatID,
            userReplies.locationRecivedNextStep
          )

          return { ...fields, location: location, }
        }
      }

      this.logger.tracedInfo(
        request,
        runtimeInformation.NO_LOCATION_IN_HANDLER
      )
    } catch (error) {
      this.logger.tracedError(
        request,
        errorMessages.ERROR_IN_LOCATION_HANDLER,
        error
      )
      this.errorWithoutAdditionalHandling.throw(
        errorMessages.ERROR_IN_USER_MESSAGE_HANDLER_CHAIN,
        runtimeInformation.NO_LOCATION_IN_HANDLER
      )
    }
    this.logger.tracedInfo(
      request,
      runtimeInformation.CAN_NOT_HANDLE_CALL_SUPER
    )
    return super.handle(request)
  }
}

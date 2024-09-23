import type TelegramBot from 'node-telegram-bot-api'
import { AbstractAsyncMessageFieldsHandler } from '../../../abstract'
import type { IUserMessageWorkingFields } from '../../../interfaces'
import errorMessages from '../../../types/errors/error-messages'
import userReplies from '../../../types/message/user-replies'
import runtimeInformation from '../../../types/utilities/runtime-information'

export class UserTimeHandler extends AbstractAsyncMessageFieldsHandler {
  public override async handle(
    request: TelegramBot.CallbackQuery | TelegramBot.Message,
    fields?: IUserMessageWorkingFields
  ): Promise<IUserMessageWorkingFields> {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

    if (!fields!.chatID) {
      this.logger.tracedInfo(request, errorMessages.CHAT_ID_NOT_FOUND_IN_FIELDS)
      return fields!
    }

    if ('text' in request && request.text && timeRegex.test(request.text)) {
      // eslint-disable-next-line no-param-reassign
      fields!.notificationTime = request.text
      this.logger.tracedInfo(
        request,
        runtimeInformation.USER_NOTIFICATION_SCHEDULED_ON_NEW_TIME
      )

      await this.botReceiver.sendMessage(
        request,
        fields!.chatID,
        userReplies.forecastNotificationScheduled
      )
      return fields!
    }
    await this.botReceiver.sendMessage(
      request,
      fields!.chatID,
      userReplies.enterTime
    )

    return fields!
  }
}

import { injectable } from 'inversify'
import type TelegramBot from 'node-telegram-bot-api'
import { ICommand, IUserMessageWorkingFields } from '../../../interfaces'
import userReplies from '../../../types/message/user-replies'
import errorMessages from '../../../types/errors/error-messages'
import { AbstractUserCommand } from '../../../abstract'

@injectable()
export class UnsubscribeCommand
  extends AbstractUserCommand
  implements ICommand {
  private readonly responseMessage = userReplies.unsubscribed

  public async execute(
    workingFields: IUserMessageWorkingFields,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): Promise<void> {
    try {
      if (!workingFields.chatID || !workingFields.userName) {
        this.logger.tracedError(
          message,
          errorMessages.CHAT_ID_NOT_FOUND
        )
        this.errorWithoutAdditionalHandling.throw(
          errorMessages.WRONG_COMMAND,
          errorMessages.CHAT_ID_NOT_FOUND
        )
      }
      this.activeUserTrack.deleteActiveUserTrack(
        workingFields.userName,
        message
      )
      await this.userListCache.deleteUser(message)
      await this.db.unsubscribe(
        message,
        workingFields.userName
      )
      this.userNotificationScheduler.cancelUserNotification(
        workingFields.userName
      )
      await this.botReceiver.sendMessage(
        message,
        workingFields.chatID,
        this.responseMessage
      )
    } catch (error: unknown) {
      this.logger.tracedError(
        message,
        errorMessages.ERROR_FETCHING_DATA,
        error
      )
      this.errorWithoutAdditionalHandling.throw(
        errorMessages.ERROR_FETCHING_DATA,
        error
      )
    }
  }
}

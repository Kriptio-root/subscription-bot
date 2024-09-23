import { injectable } from 'inversify'
import type TelegramBot from 'node-telegram-bot-api'
import { AbstractUserCommand } from '../../../abstract'
import userReplies from '../../../types/message/user-replies'
import errorMessages from '../../../types/errors/error-messages'
import type { IUserMessageWorkingFields } from '../../../interfaces'
import 'reflect-metadata'

@injectable()
export class WrongCommand extends AbstractUserCommand {
  public async execute(
    workingFields: IUserMessageWorkingFields,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): Promise<void> {
    try {
      if (!workingFields.chatID) {
        this.logger.tracedError(
          message,
          errorMessages.CHAT_ID_NOT_FOUND
        )
        this.errorWithoutAdditionalHandling.throw(
          errorMessages.WRONG_COMMAND,
          errorMessages.CHAT_ID_NOT_FOUND
        )
      }
      await this.botReceiver.sendMessage(
        message,
        workingFields.chatID,
        userReplies.wrongCommand
      )
    } catch (error: unknown) {
      this.logger.tracedError(message, errorMessages.WRONG_COMMAND, error)
      this.errorWithoutAdditionalHandling.throw(
        errorMessages.WRONG_COMMAND,
        error
      )
    }
  }
}

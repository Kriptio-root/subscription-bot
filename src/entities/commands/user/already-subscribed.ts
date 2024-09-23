import { injectable } from 'inversify'
import type TelegramBot from 'node-telegram-bot-api'
import constants from '../../../types/message/constants'
import userReplies from '../../../types/message/user-replies'
import { AbstractUserCommand } from '../../../abstract'
import { getWelcomeMessage } from '../../../types/message/interactive-strings'
import errorMessages from '../../../types/errors/error-messages'
import type { IUserMessageWorkingFields } from '../../../interfaces'
import 'reflect-metadata'
import {
  updateLocationButton,
  updateTimeButton
} from '../../../types/keyboard/reply/buttons'

@injectable()
export class AlreadySubscribedCommand extends AbstractUserCommand {
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
      this.keyboardCreator.createInlineKeyboard(
        [
          updateLocationButton,
          updateTimeButton
        ]
      )
      await this.botReceiver.sendMessage(
        message,
        workingFields.chatID,
        getWelcomeMessage(
          workingFields.userName ??
          constants.DEFAULT_USER_NAME
        ) + userReplies.welcome,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { reply_markup: this.keyboardCreator.getInlineKeyboard(), }
      )
    } catch (error: unknown) {
      this.logger.tracedError(
        message,
        errorMessages.START_COMMAND_HELLO,
        error
      )
      this.errorWithoutAdditionalHandling.throw(
        errorMessages.START_COMMAND_HELLO,
        error
      )
    }
  }
}

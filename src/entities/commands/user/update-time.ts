import { injectable } from 'inversify'
import type TelegramBot from 'node-telegram-bot-api'
import { ICommand, IUserMessageWorkingFields } from '../../../interfaces'
import errorMessages from '../../../types/errors/error-messages'
import { AbstractUserCommand } from '../../../abstract'

@injectable()
export class UpdateTimeCommand
  extends AbstractUserCommand
  implements ICommand {
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
      await this.userContext
        .transitionTo(
          this.initialUserUpdateTimeState,
          message
        )
      await this.userContext.handleInput(message)
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

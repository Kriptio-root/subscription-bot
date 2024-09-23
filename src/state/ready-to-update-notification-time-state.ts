import { inject, injectable } from 'inversify'
import TelegramBot from 'node-telegram-bot-api'
import { AbstractState } from '../abstract/state/abstract-state'
import { ILogger, IUserListCache } from '../interfaces'
import {
  IErrorWithoutAdditionalHandling
} from '../interfaces/i-error-without-additional-handling'
import errorMessages from '../types/errors/error-messages'
import { SERVICE_IDENTIFIER } from '../types/identifiers'
import userReplies from '../types/message/user-replies'

@injectable()
export class ReadyToUpdateNotificationTimeState extends AbstractState {
  public constructor(
  @inject(SERVICE_IDENTIFIER.ILogger)
    logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    errorWithoutAdditionalHandling:
    IErrorWithoutAdditionalHandling,
    @inject(SERVICE_IDENTIFIER.IUserListCache)
    protected readonly userListCache: IUserListCache
  ) {
    super(
      logger,
      errorWithoutAdditionalHandling
    )
  }

  public async handleInput(
    message: TelegramBot.CallbackQuery |
    TelegramBot.Message
  ): Promise<void> {
    if (!this.context) {
      this.errorWithoutAdditionalHandling.throw(
        errorMessages.ERROR_IN_USER_SUBSCRIBER_STATE,
        errorMessages.CONTEXT_NOT_SET
      )
    }
    const userData = this.context.getUserData(message)
    if (!userData) {
      await this.context.sendMessage(
        message,
        userReplies.enterTime
      )
      return
    }
    await this.context.updateUserNotificationTime(message, userData)
    await this.context.sendMessage(
      message,
      userReplies.timeUpdated
    )
    this.context.completeUserUpdate(message)
  }
}

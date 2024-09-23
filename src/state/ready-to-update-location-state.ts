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
export class ReadyToUpdateLocationState extends AbstractState {
  public constructor(
  @inject(SERVICE_IDENTIFIER.ILogger)
    logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IUserListCache)
    protected readonly userListCache: IUserListCache,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    errorWithoutAdditionalHandling:
    IErrorWithoutAdditionalHandling
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
        userReplies.shareUserLocationOnError
      )
      return
    }
    await this.context.updateUserLocation(message, userData)
    await this.userListCache.addUser(message)
    await this.context.sendMessage(
      message,
      userReplies.locationUpdated
    )
    this.context.completeUserUpdate(message)
  }
}

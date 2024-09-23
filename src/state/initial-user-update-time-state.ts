import { inject, injectable } from 'inversify'
import TelegramBot from 'node-telegram-bot-api'
import { AbstractState } from '../abstract/state/abstract-state'
import {
  ILogger,
  IState
} from '../interfaces'
import {
  IErrorWithoutAdditionalHandling
} from '../interfaces/i-error-without-additional-handling'
import errorMessages from '../types/errors/error-messages'
import { SERVICE_IDENTIFIER } from '../types/identifiers'
import userReplies from '../types/message/user-replies'

@injectable()
export class InitialUserUpdateTimeState extends AbstractState {
  public constructor(
  @inject(SERVICE_IDENTIFIER.ILogger)
    logger: ILogger,
    @inject(SERVICE_IDENTIFIER.WaitingForNotificationTimeUpdateState)
    private readonly waitingForNotificationTimeUpdateState: IState,
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
        errorMessages.ERROR_IN_USER_STATE_INITIALIZATION,
        errorMessages.CONTEXT_NOT_SET
      )
    }
    await this.context.transitionTo(
      this.waitingForNotificationTimeUpdateState,
      message
    )
    await this.context.sendMessage(
      message,
      userReplies.enterTime
    )
  }
}

import {
  inject,
  injectable
} from 'inversify'
import type TelegramBot from 'node-telegram-bot-api'
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
export class WaitingForLocationState extends AbstractState {
  public constructor(
  @inject(SERVICE_IDENTIFIER.ILogger)
    logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    errorWithoutAdditionalHandling:
    IErrorWithoutAdditionalHandling,
    @inject(SERVICE_IDENTIFIER.WaitingForNotificationTimeState)
    private readonly waitingForNotificationTimeState: IState
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
        errorMessages.ERROR_IN_USER_LOCATION_STATE,
        errorMessages.CONTEXT_NOT_SET
      )
    }
    if ('location' in message && message.location) {
      this.context.setCoordinates(message.location, message)
      await this.context
        .transitionTo(this.waitingForNotificationTimeState, message)
      await this.context.sendMessage(
        message,
        userReplies.enterTime
      )
    } else {
      await this.context.sendMessage(
        message,
        userReplies.shareUserLocation
      )
    }
  }
}

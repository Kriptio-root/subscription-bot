import {
  inject,
  injectable
} from 'inversify'
import type TelegramBot from 'node-telegram-bot-api'
import { AbstractState } from '../abstract/state/abstract-state'
import {
  IErrorWithoutAdditionalHandling,
  ILogger, type IMessageFieldsHandler
} from '../interfaces'
import errorMessages from '../types/errors/error-messages'
import { SERVICE_IDENTIFIER } from '../types/identifiers'
import userReplies from '../types/message/user-replies'

@injectable()
export class WaitingForNotificationTimeUpdateState extends AbstractState {
  public constructor(
  @inject(SERVICE_IDENTIFIER.ILogger)
    logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    errorWithoutAdditionalHandling:
    IErrorWithoutAdditionalHandling,
    @inject(SERVICE_IDENTIFIER.ReadyToUpdateNotificationTimeState)
    private readonly readyToUpdateNotificationTimeState: AbstractState,
    @inject(SERVICE_IDENTIFIER.ChatIdHandler)
    private readonly chatIdHandler: IMessageFieldsHandler,
    @inject(SERVICE_IDENTIFIER.UserTimeHandler)
    private readonly userTimeHandler: IMessageFieldsHandler
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
        errorMessages.ERROR_IN_USER_NOTIFICATION_TIME_STATE,
        errorMessages.CONTEXT_NOT_SET
      )
    }
    this.chatIdHandler
      .setNext(this.userTimeHandler)
    const fields = await this.chatIdHandler.handle(message)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
    if (fields.notificationTime && timeRegex.test(fields.notificationTime)) {
      this.context.setNotificationTime(
        fields.notificationTime,
        message
      )
      await this.context.transitionTo(
        this.readyToUpdateNotificationTimeState,
        message
      )
      await this.context.handleInput(message)
    } else {
      await this.context.sendMessage(
        message,
        userReplies.enterTime
      )
    }
  }
}

import { inject, injectable } from 'inversify'
import TelegramBot from 'node-telegram-bot-api'
import { AbstractState } from '../abstract/state/abstract-state'
import {
  IKeyboardCreator,
  ILogger,
  IState
} from '../interfaces'
import {
  IErrorWithoutAdditionalHandling
} from '../interfaces/i-error-without-additional-handling'
import { SERVICE_IDENTIFIER } from '../types/identifiers'
import { getUserGeolocationButton } from '../types/keyboard/reply/buttons'
import errorMessages from '../types/errors/error-messages'
import userReplies from '../types/message/user-replies'

@injectable()
export class InitialUserState extends AbstractState {
  public constructor(
  @inject(SERVICE_IDENTIFIER.ILogger)
    logger: ILogger,
    @inject(SERVICE_IDENTIFIER.WaitingForLocationState)
    private readonly waitingForLocationState: IState,
    @inject(SERVICE_IDENTIFIER.IKeyboardCreator)
    protected keyboardCreator: IKeyboardCreator,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    errorWithoutAdditionalHandling:
    IErrorWithoutAdditionalHandling
  ) {
    super(
      logger,
      errorWithoutAdditionalHandling
    )
    this.keyboardCreator.clearReplyKeyboard()
    this.keyboardCreator.createReplyKeyboard(getUserGeolocationButton)
    this.initialReplyKeyboard = this.keyboardCreator.getReplyKeyboard()
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
      this.waitingForLocationState,
      message
    )
    await this.context.sendMessage(
      message,
      userReplies.shareUserLocation,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      { reply_markup: this.initialReplyKeyboard!, }
    )
  }
}

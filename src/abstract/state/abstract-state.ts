import {
  injectable,
  inject
} from 'inversify'
import TelegramBot, { ReplyKeyboardMarkup } from 'node-telegram-bot-api'
import {
  ILogger,
  IUserContext
} from '../../interfaces'
import {
  IErrorWithoutAdditionalHandling
} from '../../interfaces/i-error-without-additional-handling'

import { SERVICE_IDENTIFIER } from '../../types/identifiers'

@injectable()
export abstract class AbstractState {
  protected context: IUserContext | undefined

  protected initialReplyKeyboard: ReplyKeyboardMarkup | undefined

  protected geolocationReplyKeyboard: ReplyKeyboardMarkup | undefined

  public constructor(
    @inject(SERVICE_IDENTIFIER.ILogger)
    protected readonly logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    protected readonly errorWithoutAdditionalHandling:
    IErrorWithoutAdditionalHandling
  ) {}

  public setContext(context: IUserContext): void {
    this.context = context
  }

  public abstract handleInput(
    message: TelegramBot.CallbackQuery |
    TelegramBot.Message
  ): Promise<void>
}

import {
  injectable,
  inject
} from 'inversify'
import type {
  InlineKeyboardButton,
  KeyboardButton,
  ReplyKeyboardMarkup,
  InlineKeyboardMarkup
} from 'node-telegram-bot-api'
import {
  IInlineKeyboard,
  IKeyboardButtonCreator,
  IKeyboardInlineButtonsCreator,
  ILogger,
  IReplyKeyboard
} from '../../../interfaces'
import { SERVICE_IDENTIFIER } from '../../../types/identifiers'
import runtimeInformation from '../../../types/utilities/runtime-information'
import { ErrorWithoutAdditionalHandling } from '../../errors'
import errorMessages from '../../../types/errors/error-messages'

@injectable()
export class KeyboardCreator {
  private replyKeyboardMarkup: ReplyKeyboardMarkup | undefined

  private inlineKeyboardMarkup: InlineKeyboardMarkup | undefined

  public constructor(
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IKeyboardButtonCreator)
    private readonly keyboardButtonCreator: IKeyboardButtonCreator,
    @inject(SERVICE_IDENTIFIER.IReplyKeyboard)
    private readonly replyKeyboard: IReplyKeyboard,
    @inject(SERVICE_IDENTIFIER.IInlineKeyboard)
    private readonly inlineKeyboard: IInlineKeyboard,
    @inject(SERVICE_IDENTIFIER.IKeyboardInlineButtonsCreator)
    private readonly keyboardInlineButtonCreator: IKeyboardInlineButtonsCreator,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    private readonly errorWithoutAdditionalHandling:
    ErrorWithoutAdditionalHandling
  ) {}

  public createReplyKeyboard(button: KeyboardButton): void {
    this.logger.info(runtimeInformation.CREATING_KEYBOARD)
    if (!this.replyKeyboardMarkup) {
      this.replyKeyboard
        .initializeKeyboard(
          this.keyboardButtonCreator.createButtons([button])
        )
      this.replyKeyboardMarkup = this.replyKeyboard.getReplyKeyboard()
      this.logger.info(runtimeInformation.KEYBOARD_CREATED)
    } else {
      this.logger.info(runtimeInformation.KEYBOARD_ALREADY_CREATED)
    }
  }

  public createInlineKeyboard(button: InlineKeyboardButton[]): void {
    if (!this.inlineKeyboardMarkup) {
      this.logger.info(runtimeInformation.CREATING_KEYBOARD)
      this.inlineKeyboard
        .initializeInlineKeyboard(
          this.keyboardInlineButtonCreator.createButtons(button)
        )
      this.inlineKeyboardMarkup = this.inlineKeyboard.getInlineKeyboard()
      this.logger.info(runtimeInformation.KEYBOARD_CREATED)
    } else {
      this.logger.info(runtimeInformation.KEYBOARD_ALREADY_CREATED)
    }
  }

  public getReplyKeyboard(): ReplyKeyboardMarkup {
    if (!this.replyKeyboardMarkup) {
      return this.errorWithoutAdditionalHandling.throw(
        errorMessages.KEYBOARD_NOT_INITIALIZED,
        errorMessages.ERROR_IN_KEYBOARD_CREATION
      )
    }
    return this.replyKeyboardMarkup
  }

  public getInlineKeyboard(): InlineKeyboardMarkup {
    if (!this.inlineKeyboardMarkup) {
      return this.errorWithoutAdditionalHandling.throw(
        errorMessages.KEYBOARD_NOT_INITIALIZED,
        errorMessages.ERROR_IN_KEYBOARD_CREATION
      )
    }
    return this.inlineKeyboardMarkup
  }

  public clearReplyKeyboard(): void {
    this.replyKeyboardMarkup = undefined
  }

  public clearInlineKeyboard(): void {
    this.inlineKeyboardMarkup = undefined
  }
}

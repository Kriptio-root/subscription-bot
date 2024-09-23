import {
  InlineKeyboardMarkup,
  InlineKeyboardButton
} from 'node-telegram-bot-api'
import { inject, injectable } from 'inversify'
import { IInlineKeyboard } from '../../../../../interfaces'
import {
  IErrorWithoutAdditionalHandling
} from '../../../../../interfaces/i-error-without-additional-handling'
import { SERVICE_IDENTIFIER } from '../../../../../types/identifiers'
import errorMessages from '../../../../../types/errors/error-messages'

@injectable()
export class InlineKeyboard implements IInlineKeyboard {
  public inlineKeyboardMarkup: InlineKeyboardMarkup | undefined

  public constructor(
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    private readonly errorWithoutAdditionalHandling:
    IErrorWithoutAdditionalHandling
  ) {}

  public getInlineKeyboard(): InlineKeyboardMarkup {
    if (!this.inlineKeyboardMarkup) {
      return this.errorWithoutAdditionalHandling.throw(
        errorMessages.ERROR_IN_INLINE_KEYBOARD,
        errorMessages.INLINE_KEYBOARD_NOT_INITIALIZED
      )
    }
    return this.inlineKeyboardMarkup
  }

  public initializeInlineKeyboard(
    buttons: InlineKeyboardButton[][]
  ): void {
    this.inlineKeyboardMarkup = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      inline_keyboard: buttons,
    }
  }
}

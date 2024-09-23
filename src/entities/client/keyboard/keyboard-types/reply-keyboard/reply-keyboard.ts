import { ReplyKeyboardMarkup, KeyboardButton } from 'node-telegram-bot-api'
import { inject, injectable } from 'inversify'
import { IReplyKeyboard } from '../../../../../interfaces'
import {
  IErrorWithoutAdditionalHandling
} from '../../../../../interfaces/i-error-without-additional-handling'
import errorMessages from '../../../../../types/errors/error-messages'
import { SERVICE_IDENTIFIER } from '../../../../../types/identifiers'

@injectable()
export class ReplyKeyboard implements IReplyKeyboard {
  public replyKeyboardMarkup: ReplyKeyboardMarkup | undefined

  public constructor(
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    private readonly errorWithoutAdditionalHandling:
    IErrorWithoutAdditionalHandling
  ) {}

  public getReplyKeyboard(): ReplyKeyboardMarkup {
    if (!this.replyKeyboardMarkup) {
      return this.errorWithoutAdditionalHandling.throw(
        errorMessages.ERROR_IN_REPLY_KEYBOARD,
        errorMessages.REPLY_KEYBOARD_NOT_INITIALIZED
      )
    }
    return this.replyKeyboardMarkup
  }

  public initializeKeyboard(
    buttons: KeyboardButton[][]
  ): void {
    this.replyKeyboardMarkup = {
      keyboard: buttons,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      resize_keyboard: true,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      one_time_keyboard: true,
    }
  }
}

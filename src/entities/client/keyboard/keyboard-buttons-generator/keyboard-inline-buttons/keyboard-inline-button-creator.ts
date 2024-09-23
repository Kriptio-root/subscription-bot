import { injectable } from 'inversify'
import TelegramBot, { InlineKeyboardButton } from 'node-telegram-bot-api'
import {
  AbstractKeyboardButtonsCreator
} from '../../../../../abstract/client/keyboard/keyboard-buttons-generator/abstract-keyboard-buttons-creator'
import {
  IKeyboardInlineButtonsCreator
} from '../../../../../interfaces'

@injectable()
export class KeyboardInlineButtonCreator
  extends AbstractKeyboardButtonsCreator
  implements IKeyboardInlineButtonsCreator {
  public buttons: InlineKeyboardButton[][] = []

  public createButtons(
    button: TelegramBot.InlineKeyboardButton[]
  ): InlineKeyboardButton[][] {
    this.buttons.push(button)
    return this.buttons
  }
}

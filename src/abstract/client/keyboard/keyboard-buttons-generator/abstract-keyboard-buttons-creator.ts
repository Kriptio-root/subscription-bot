import { injectable } from 'inversify'
import {
  InlineKeyboardButton,
  KeyboardButton
} from 'node-telegram-bot-api'

@injectable()
export abstract class AbstractKeyboardButtonsCreator {
  public abstract buttons: InlineKeyboardButton[][] | KeyboardButton[][]

  public getButtons(): InlineKeyboardButton[][] | KeyboardButton[][] {
    return this.buttons
  }

  public clearButtons(): void {
    this.buttons = []
  }
}

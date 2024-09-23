import type { KeyboardButton } from 'node-telegram-bot-api'

export interface IKeyboardButtonCreator {
  buttons: KeyboardButton[][];
  // eslint-disable-next-line @stylistic/max-len,@typescript-eslint/naming-convention
  createButtons: (keyboardButtonValues: KeyboardButton[]) => KeyboardButton[][]

}

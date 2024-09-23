import { inject, injectable } from 'inversify'
import { KeyboardButton } from 'node-telegram-bot-api'
import {
  AbstractKeyboardButtonsCreator
} from '../../../../../abstract/client/keyboard/keyboard-buttons-generator/abstract-keyboard-buttons-creator'
import {
  IKeyboardButtonCreator,
  ILogger
} from '../../../../../interfaces'
import { SERVICE_IDENTIFIER } from '../../../../../types/identifiers'
import runtimeInformation
  from '../../../../../types/utilities/runtime-information'

@injectable()
export class KeyboardButtonCreator
  extends AbstractKeyboardButtonsCreator
  implements IKeyboardButtonCreator {
  public buttons: KeyboardButton[][] = []

  public constructor(
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger
  ) {
    super()
  }

  // eslint-disable-next-line @stylistic/max-len
  public createButtons(keyboardButtonValues: KeyboardButton[]): KeyboardButton[][] {
    this.logger.info(
      runtimeInformation.CREATING_KEYBOARD_BUTTONS
    )

    this.buttons = keyboardButtonValues.map((button) => {
      return [
        {
          text: button.text,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          request_location: button.request_location,
        }
      ]
    })

    return this.buttons
  }
}

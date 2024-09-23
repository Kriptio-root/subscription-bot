import type TelegramBot from 'node-telegram-bot-api'
import messageConstants from '../../types/message/constants'
import { AbstractAsyncMessageFieldsHandler } from './abstract-async-message-fields-handler'

export abstract class AbstractBaseCommandHandler
  extends AbstractAsyncMessageFieldsHandler {
  protected convertedMessage: string = ''

  public getLastConvertedCommand(): string {
    return this.convertedMessage
  }

  protected removeCommandPrefix(
    message: string | undefined
  ): string | undefined {
    if (!message) {
      return undefined
    }
    if (message.startsWith(messageConstants.COMMAND_PREFIX)) {
      return message
        .substring(messageConstants.COMMAND_PREFIX_LENGTH).toLowerCase()
    }
    return message.toLowerCase()
  }

  protected setLastConvertedCommand(command: string): void {
    this.convertedMessage = command
  }

  protected abstract isCallbackQuery(
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): boolean
}

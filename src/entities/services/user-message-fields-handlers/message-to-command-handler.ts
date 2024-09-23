import { injectable, inject } from 'inversify'
import type TelegramBot from 'node-telegram-bot-api'
import {
  AbstractBaseCommandHandler
} from '../../../abstract/services/abstract-base-command-handler'
import {
  IBotReceiver,
  ILogger,
  IUserMessageWorkingFields
} from '../../../interfaces'
import {
  IErrorWithoutAdditionalHandling
} from '../../../interfaces/i-error-without-additional-handling'
import errorMessages from '../../../types/errors/error-messages'
import { SERVICE_IDENTIFIER } from '../../../types/identifiers'
import messageConstants from '../../../types/message/constants'
import runtimeInformation from '../../../types/utilities/runtime-information'

@injectable()
export class MessageToCommandHandler extends AbstractBaseCommandHandler {
  private command: string | undefined = undefined

  public constructor(
  @inject(SERVICE_IDENTIFIER.ILogger)
    logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IBotReceiver)
    botReceiver: IBotReceiver,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    errorWithoutAdditionalHandling: IErrorWithoutAdditionalHandling
  ) {
    super(
      logger,
      botReceiver,
      errorWithoutAdditionalHandling
    )
  }

  public override async handle(
    request: TelegramBot.CallbackQuery | TelegramBot.Message,
    fields?: IUserMessageWorkingFields
  ): Promise<IUserMessageWorkingFields> {
    try {
      if (!fields!.chatID) {
        this.logger.error(
          errorMessages.MESSAGE_CONVERTATION,
          errorMessages.CHAT_ID_NOT_FOUND
        )
        this.errorWithoutAdditionalHandling.throw(
          errorMessages.MESSAGE_TO_COMMAND_CONVERT,
          errorMessages.CHAT_ID_NOT_FOUND
        )
      }
      this.logger.tracedInfo(
        request,
        runtimeInformation.MESSAGE_TO_COMMAND_CONVERT
      )
      if (messageConstants.DATA in request) {
        this.command = this.removeCommandPrefix(request.data)
        return { ...fields, command: this.command!, }
      }
      if (messageConstants.TEXT in request) {
        this.command = this.removeCommandPrefix(request.text)
        return { ...fields, command: this.command!, }
      }

      if (!this.command) {
        this.logger.tracedError(
          request,
          errorMessages.MESSAGE_CONVERTATION
        )
        return fields!
      }

      this.setLastConvertedCommand(this.command)
      this.logger.tracedInfo(
        request,
        runtimeInformation.CALL_NEXT_HANDLER
      )
      return {
        ...fields,
        command: this.getLastConvertedCommand(),
      }
    } catch (error) {
      this.logger.tracedError(
        request,
        errorMessages.MESSAGE_TO_COMMAND_CONVERT,
        error
      )
      return super.handle(request)
    }
  }

  protected isCallbackQuery(
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): boolean {
    return messageConstants.DATA in message
  }
}

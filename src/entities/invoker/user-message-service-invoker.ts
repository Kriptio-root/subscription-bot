import { injectable, inject } from 'inversify'
import TelegramBot from 'node-telegram-bot-api'
import {
  IErrorWithoutAdditionalHandling
} from '../../interfaces/i-error-without-additional-handling'
import errorMessages from '../../types/errors/error-messages'
import type {
  IUserMessageWorkingFields,
  ICommandFactory,
  ILogger,
  IUserMessageServiceInvoker
} from '../../interfaces'
import { SERVICE_IDENTIFIER } from '../../types/identifiers'
import 'reflect-metadata'
import runtimeInformation from '../../types/utilities/runtime-information'

@injectable()
export class UserMessageServiceInvoker implements IUserMessageServiceInvoker {
  public constructor(
    @inject(SERVICE_IDENTIFIER.ICommandFactory)
    private readonly commandFactory: ICommandFactory,
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    private readonly errorWithoutAdditionalHandling:
    IErrorWithoutAdditionalHandling
  ) {}

  public async execute(
    workingFields: IUserMessageWorkingFields,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): Promise<void> {
    try {
      this.logger.tracedInfo(
        message,
        runtimeInformation.EXECUTING_COMMAND,
        workingFields.command
      )
      await this.commandFactory
        .getConcreteCommand(
          workingFields,
          message
        )
        .execute(
          workingFields,
          message
        )
    } catch (error) {
      this.logger.tracedError(
        message,
        errorMessages.INVOKER_ERROR_RUNNING_COMMAND
      )
      this.errorWithoutAdditionalHandling.throw(
        errorMessages.INVOKER_ERROR_RUNNING_COMMAND,
        error
      )
    }
  }
}

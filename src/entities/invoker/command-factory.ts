import { injectable, inject } from 'inversify'
import TelegramBot from 'node-telegram-bot-api'
import { AbstractUserCommand } from '../../abstract'
import {
  IBotReceiver,
  ICommandFactory,
  ISendMessageComposer, type IUserMessageWorkingFields,
  ILogger
} from '../../interfaces'
import {
  IErrorWithoutAdditionalHandling
} from '../../interfaces/i-error-without-additional-handling'
import errorMessages from '../../types/errors/error-messages'
import { SERVICE_IDENTIFIER } from '../../types/identifiers'
import 'reflect-metadata'

@injectable()
export class CommandFactory implements ICommandFactory {
  protected commandMap: { [key: string]: AbstractUserCommand }

  public constructor(
    @inject(SERVICE_IDENTIFIER.IBotReceiver)
    protected botReceiver: IBotReceiver,
    @inject(SERVICE_IDENTIFIER.ISendMessageComposer)
    protected sendMessageComposer: ISendMessageComposer,
    @inject(SERVICE_IDENTIFIER.UserCommands)
    protected readonly userCommands: string[],
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger,
    @inject(SERVICE_IDENTIFIER.StartCommand)
    startCommand: AbstractUserCommand,
    @inject(SERVICE_IDENTIFIER.WrongCommand)
    wrongCommand: AbstractUserCommand,
    @inject(SERVICE_IDENTIFIER.UpdateLocationCommand)
    updateLocationCommand: AbstractUserCommand,
    @inject(SERVICE_IDENTIFIER.UpdateTimeCommand)
    updateTimeCommand: AbstractUserCommand,
    @inject(SERVICE_IDENTIFIER.SubscribeCommand)
    subscribeCommand: AbstractUserCommand,
    @inject(SERVICE_IDENTIFIER.UnsubscribeCommand)
    unsubscribeCommand: AbstractUserCommand,
    @inject(SERVICE_IDENTIFIER.AlreadySubscribedCommand)
    alreadySubscribedCommand: AbstractUserCommand,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    private readonly errorWithoutAdditionalHandling:
    IErrorWithoutAdditionalHandling
  ) {
    this.commandMap = {
      start: startCommand,
      wrong: wrongCommand,
      updatelocation: updateLocationCommand,
      updatetime: updateTimeCommand,
      subscribe: subscribeCommand,
      unsubscribe: unsubscribeCommand,
      alreadysubscribed: alreadySubscribedCommand,
    }
  }

  public getConcreteCommand(
    workingFields: IUserMessageWorkingFields,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): AbstractUserCommand {
    let concreteCommand: AbstractUserCommand | undefined
    if (workingFields.command) {
      concreteCommand = this.commandMap[workingFields.command]
    }
    if (!concreteCommand) {
      this.logger.tracedError(
        message,
        errorMessages.PROVIDED_COMMAND_NOT_FOUND,
        errorMessages.COMMAND_MALFORMED
      )
      return this.errorWithoutAdditionalHandling.throw(
        errorMessages.PROVIDED_COMMAND_NOT_FOUND,
        errorMessages.COMMAND_MALFORMED
      )
    }
    return concreteCommand
  }
}

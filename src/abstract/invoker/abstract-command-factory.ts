import { injectable } from 'inversify'
import {
  CallbackQuery,
  Message
} from 'node-telegram-bot-api'
import type {
  ICommandFactory,
  IBotReceiver,
  ISendMessageComposer,
  IUserMessageWorkingFields
} from '../../interfaces'
import type { AbstractUserCommand } from '../commands/user/abstract-user-command'
import 'reflect-metadata'

@injectable()
export abstract class AbstractCommandFactory implements ICommandFactory {
  protected abstract readonly commandMap: {
    [key: string]: new (
      botReceiver: IBotReceiver,
      sendMessageComposer: ISendMessageComposer,
    ) => AbstractUserCommand
  }

  public abstract getConcreteCommand(
    workingFields: IUserMessageWorkingFields,
    message: CallbackQuery | Message
  ): AbstractUserCommand

  public abstract registerCommands(): void
}

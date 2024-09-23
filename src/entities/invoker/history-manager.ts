import type TelegramBot from 'node-telegram-bot-api'
import { inject, injectable } from 'inversify'
import type { IHistoryManager, ILogger } from '../../interfaces'
import historyManager from '../../types/commands/history-manager'
import 'reflect-metadata'
import { SERVICE_IDENTIFIER } from '../../types/identifiers'
import runtimeInformation from '../../types/utilities/runtime-information'

@injectable()
export class HistoryManager implements IHistoryManager {
  private readonly history = new Map<number,
  TelegramBot.CallbackQuery | TelegramBot.Message
  >()

  private counter: number = historyManager.COUNTER_INITIALIZATION_VALUE

  public constructor(
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger
  ) {}

  public recordMessage(
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): void {
    this.logger.tracedInfo(message, runtimeInformation.NEW_HISTORY_RECORD)
    this.history.set(this.counter++, message)
  }

  public getHistory(): Map<number, TelegramBot.CallbackQuery
  | TelegramBot.Message> {
    return this.history
  }
}

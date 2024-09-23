import { injectable, inject } from 'inversify'
import type TelegramBot from 'node-telegram-bot-api'
import {
  IBotAdapter,
  IBotCommandsInitializer,
  IBotEventHandler,
  IBotService, IUserListCache
} from '../../interfaces'
import 'reflect-metadata'
import { SERVICE_IDENTIFIER } from '../../types/identifiers'

@injectable()
export class BotService implements IBotService {
  private readonly bot: TelegramBot

  public constructor(
  @inject(SERVICE_IDENTIFIER.BotAdapter)
    botAdapter: IBotAdapter,
    @inject(SERVICE_IDENTIFIER.IBotCommandsInitializer)
    private readonly initializer: IBotCommandsInitializer,
    @inject(SERVICE_IDENTIFIER.IBotEventHandler)
    private readonly eventHandler: IBotEventHandler,
    @inject(SERVICE_IDENTIFIER.IUserListCache)
    private readonly userListCache: IUserListCache
  ) {
    this.bot = botAdapter.getBot()
  }

  public async initialize(): Promise<void> {
    await this.initializer.initializeBotCommands()
    this.eventHandler.setupEventHandlers()
    await this.userListCache.initializeCache()
  }

  public getBot(): TelegramBot {
    return this.bot
  }
}

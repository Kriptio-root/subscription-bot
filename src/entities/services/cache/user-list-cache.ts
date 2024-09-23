import {
  injectable,
  inject
} from 'inversify'
import TelegramBot from 'node-telegram-bot-api'
import {
  IMessageFieldsHandler,
  ILogger,
  IDB,
  ITimers,
  IUserListCache
} from '../../../interfaces'
import errorMessages from '../../../types/errors/error-messages'
import { SERVICE_IDENTIFIER } from '../../../types/identifiers'
import runtimeInformation from '../../../types/utilities/runtime-information'

@injectable()
export class UserListCache implements IUserListCache {
  private userList: Set<string>

  private cacheTimer: NodeJS.Timeout | undefined

  public constructor(
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger,
    @inject(SERVICE_IDENTIFIER.ChatIdHandler)
    private readonly chatIdHandler: IMessageFieldsHandler,
    @inject(SERVICE_IDENTIFIER.UserNameHandler)
    private readonly userNameHandler: IMessageFieldsHandler,
    @inject(SERVICE_IDENTIFIER.IDB)
    private readonly db: IDB,
    @inject(SERVICE_IDENTIFIER.Timers)
    private readonly timers: ITimers
  ) {
    this.chatIdHandler.setNext(this.userNameHandler)
    this.userList = new Set()
  }

  public async addUser(
    message: TelegramBot.CallbackQuery |
    TelegramBot.Message
  ): Promise<void> {
    this.logger.tracedInfo(
      message,
      runtimeInformation.ADDING_USER_TO_CACHE
    )
    const fields = await this.chatIdHandler.handle(message)
    if (fields.userName) {
      this.userList.add(fields.userName)
    }
  }

  public async hasUser(
    message: TelegramBot.CallbackQuery |
    TelegramBot.Message
  ): Promise<boolean> {
    const fields = await this.chatIdHandler.handle(message)
    if (fields.userName) {
      return this.userList.has(fields.userName)
    }
    return false
  }

  public async deleteUser(
    message: TelegramBot.CallbackQuery |
    TelegramBot.Message
  ): Promise<void> {
    const fields = await this.chatIdHandler.handle(message)
    if (fields.userName) {
      this.userList.delete(fields.userName)
    }
  }

  public async initializeCache(): Promise<void> {
    await this.loadUserListFromDB()
    this.startCacheTimer()
  }

  public stopCacheTimer(): void {
    if (this.cacheTimer) {
      clearTimeout(this.cacheTimer)
      this.cacheTimer = undefined
    }
  }

  private async loadUserListFromDB(): Promise<void> {
    try {
      this.logger.info(runtimeInformation.LOADED_USER_LIST_FROM_DB)
      const userNames = await this.db.getAllUserNames()
      this.userList = new Set(userNames)
      this.logger.info(runtimeInformation.USER_LIST_LOADED_SUCCESSFULLY)
    } catch (error) {
      this.logger.error(errorMessages.ERROR_LOADING_USER_LIST_FROM_DB, error)
    }
  }

  private startCacheTimer(): void {
    this.cacheTimer = this.timers.getCacheTTLTimer(async () => {
      await this.loadUserListFromDB()
      this.startCacheTimer()
    })
  }
}

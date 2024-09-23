import { inject, injectable } from 'inversify'
import {
  IBotAdapter,
  IBotCommandsInitializer,
  IBotEventHandler,
  IBotService,
  IBotServiceFactory,
  IUserListCache
} from '../../../interfaces'
import 'reflect-metadata'
import { BotService } from '../../services/bot-service'
import { SERVICE_IDENTIFIER } from '../../../types/identifiers'

@injectable()
export class BotServiceFactory implements IBotServiceFactory {
  public constructor(
    @inject(SERVICE_IDENTIFIER.IBotAdapter)
    private readonly botAdapter: IBotAdapter,
    @inject(SERVICE_IDENTIFIER.IBotCommandsInitializer)
    private readonly initializer: IBotCommandsInitializer,
    @inject(SERVICE_IDENTIFIER.IBotEventHandler)
    private readonly eventHandler: IBotEventHandler,
    @inject(SERVICE_IDENTIFIER.IUserListCache)
    private readonly userListCache: IUserListCache
  ) {}

  public createBotService(): IBotService {
    return new BotService(
      this.botAdapter,
      this.initializer,
      this.eventHandler,
      this.userListCache
    )
  }
}

import {
  injectable,
  inject
} from 'inversify'
import type TelegramBot from 'node-telegram-bot-api'
import {
  ICommand,
  IBotReceiver,
  ISendMessageComposer,
  IUserMessageWorkingFields,
  ILogger,
  IDB,
  IUserContext,
  IKeyboardCreator,
  IUserListCache,
  IActiveUserTrack,
  IMessageFieldsHandler,
  IRequestHandler,
  IState,
  type IUserNotificationScheduler
} from '../../../interfaces'
import 'reflect-metadata'
import {
  IErrorWithoutAdditionalHandling
} from '../../../interfaces/i-error-without-additional-handling'
import { SERVICE_IDENTIFIER } from '../../../types/identifiers'

@injectable()
export abstract class AbstractUserCommand implements ICommand {
  public constructor(
    @inject(SERVICE_IDENTIFIER.IBotReceiver)
    protected botReceiver: IBotReceiver,
    @inject(SERVICE_IDENTIFIER.ISendMessageComposer)
    protected sendMessageComposer: ISendMessageComposer,
    @inject(SERVICE_IDENTIFIER.ILogger)
    protected logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IKeyboardCreator)
    protected keyboardCreator: IKeyboardCreator,
    @inject(SERVICE_IDENTIFIER.IDB)
    protected db: IDB,
    @inject(SERVICE_IDENTIFIER.IUserContext)
    protected userContext: IUserContext,
    @inject(SERVICE_IDENTIFIER.IUserListCache)
    protected userListCache: IUserListCache,
    @inject(SERVICE_IDENTIFIER.IActiveUserTrack)
    protected activeUserTrack: IActiveUserTrack,
    @inject(SERVICE_IDENTIFIER.ChatIdHandler)
    protected chatIdHandler: IMessageFieldsHandler,
    @inject(SERVICE_IDENTIFIER.UserLocationHandler)
    protected userLocationHandler: IMessageFieldsHandler,
    @inject(SERVICE_IDENTIFIER.UserTimeHandler)
    protected userTimeHandler: IMessageFieldsHandler,
    @inject(SERVICE_IDENTIFIER.IRequestHandler)
    protected requestHandler: IRequestHandler,
    @inject(SERVICE_IDENTIFIER.InitialUserUpdateLocationState)
    protected initialUserUpdateLocationState: IState,
    @inject(SERVICE_IDENTIFIER.InitialUserUpdateTimeState)
    protected initialUserUpdateTimeState: IState,
    @inject(SERVICE_IDENTIFIER.InitialUserState)
    protected initialUserState: IState,
    @inject(SERVICE_IDENTIFIER.IUserNotificationScheduler)
    protected readonly userNotificationScheduler: IUserNotificationScheduler,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    protected errorWithoutAdditionalHandling: IErrorWithoutAdditionalHandling
  ) {}

  public abstract execute(
    workingFields: IUserMessageWorkingFields,
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
  ): Promise<void>
}

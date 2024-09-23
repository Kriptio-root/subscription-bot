import type {
  CallbackQuery,
  Message
} from 'node-telegram-bot-api'
import { injectable, inject } from 'inversify'
import {
  IUserMessageWorkingFields,
  IUserMessageServiceInvoker,
  IMessageProcessor,
  IHistoryManager,
  ILogger,
  IMessageFieldsHandler,
  IActiveUserTrack,
  IUserContext,
  IUserListCache
} from '../../interfaces'
import errorMessages from '../../types/errors/error-messages'
import { SERVICE_IDENTIFIER } from '../../types/identifiers'
import 'reflect-metadata'
import messageConstants from '../../types/message/constants'
import runtimeInformation from '../../types/utilities/runtime-information'

@injectable()
export class MessageProcessor implements IMessageProcessor {
  public constructor(
    @inject(SERVICE_IDENTIFIER.IUserMessageServiceInvoker)
    private readonly invoker: IUserMessageServiceInvoker,
    @inject(SERVICE_IDENTIFIER.IHistoryManager)
    private readonly historyManager: IHistoryManager,
    @inject(SERVICE_IDENTIFIER.IWorkingFieldsInitializer)
    private readonly workingFieldsInitializer: IMessageFieldsHandler,
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IUserContext)
    private readonly userContext: IUserContext,
    @inject(SERVICE_IDENTIFIER.IActiveUserTrack)
    private readonly activeUserTrack: IActiveUserTrack,
    @inject(SERVICE_IDENTIFIER.IUserListCache)
    private readonly userListCache: IUserListCache
  ) {}

  public async processMessage(message: CallbackQuery | Message): Promise<void> {
    let workingFields: IUserMessageWorkingFields | undefined

    try {
      this.historyManager.recordMessage(message)
      workingFields = await this.workingFieldsInitializer.handle(message)
      const activeUser = this.activeUserTrack
        .getActiveUserTrack(
          workingFields.userName!,
          message
        )
      if (
        workingFields.command === messageConstants.SUBSCRIBE &&
        await this.userListCache.hasUser(message)
      ) {
        this.logger.tracedInfo(
          message,
          runtimeInformation.USER_ALREADY_SUBSCRIBED
        )
        workingFields.command = messageConstants.ALREADY_SUBSCRIBED
      }
      if (workingFields.userName && activeUser) {
        this.logger.tracedInfo(
          message,
          runtimeInformation.USER_IS_ACTIVE_USER
        )
        await this.userContext.transitionTo(
          activeUser.state,
          message
        )
        await this.userContext.handleInput(message)
        return
      }
      await this.invoker.execute(workingFields, message)
    } catch (error) {
      this.logger.tracedError(
        message,
        errorMessages.ERROR_IN_MESSAGE_PROCESSING,
        error
      )
      if (workingFields) {
        workingFields.command = messageConstants.WRONG_COMMAND
        await this.invoker.execute(
          workingFields,
          message
        )
      }
    }
  }
}

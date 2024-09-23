import { injectable, inject } from 'inversify'
import TelegramBot from 'node-telegram-bot-api'
import {
  IActiveUserTrack,
  IActiveUserTrackData,
  IBotReceiver,
  ILogger,
  IUserContext,
  IMessageFieldsHandler,
  IDB,
  IStateManager,
  IState,
  IUserListCache,
  IUserMessageWorkingFields,
  type IUserNotificationScheduler
} from '../interfaces'
import errorMessages from '../types/errors/error-messages'
import { SERVICE_IDENTIFIER } from '../types/identifiers'
import {
  subscriptionSavedForUser,
  userContextTransitionTo,
  coordinatesSetForUser,
  userDataNotFound,
  userNotificationTimeSet,
  errorSavingSubscription,
  subscriptionProcessCompleted,
  userUpdateProcessCompleted,
  messageSentToUser,
  errorSendingMessage,
  locationUpdatedForUser,
  errorUpdatingLocation,
  notificationTimeUpdatedForUser,
  errorUpdatingNotificationTime
} from '../types/message/interactive-strings'

@injectable()
export class UserContext implements IUserContext {
  private userName: string = ''

  public constructor(
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IStateManager)
    private readonly stateManager: IStateManager,
    @inject(SERVICE_IDENTIFIER.IActiveUserTrack)
    private readonly activeUserTrack: IActiveUserTrack,
    @inject(SERVICE_IDENTIFIER.IBotReceiver)
    protected readonly botReceiver: IBotReceiver,
    @inject(SERVICE_IDENTIFIER.UserNameHandler)
    private readonly userNameHandler: IMessageFieldsHandler,
    @inject(SERVICE_IDENTIFIER.UserLocationHandler)
    private readonly userLocationHandler: IMessageFieldsHandler,
    @inject(SERVICE_IDENTIFIER.UserTimeHandler)
    private readonly userTimeHandler: IMessageFieldsHandler,
    @inject(SERVICE_IDENTIFIER.IDB)
    private readonly db: IDB,
    @inject(SERVICE_IDENTIFIER.ChatIdHandler)
    private readonly chatIdHandler: IMessageFieldsHandler,
    @inject(SERVICE_IDENTIFIER.IUserListCache)
    private readonly userCache: IUserListCache,
    @inject(SERVICE_IDENTIFIER.IUserNotificationScheduler)
    private readonly userNotificationScheduler: IUserNotificationScheduler
  ) {
    this.stateManager.initializeState(this)
  }

  public async handleInput(
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): Promise<void> {
    await this.stateManager.handleInput(message)
  }

  public async transitionTo(
    state: IState,
    message?: TelegramBot.CallbackQuery | TelegramBot.Message
  ): Promise<void> {
    this.stateManager.setState(state, this)

    if (message) {
      this.logger.tracedInfo(
        message,
        userContextTransitionTo(state.constructor.name)
      )
      this.chatIdHandler
        .setNext(this.userNameHandler)

      const fields = await this.chatIdHandler.handle(message)

      if (fields.userName) {
        this.userName = fields.userName
        await this.activeUserTrack.setUserState(
          this.userName,
          state,
          message
        )
      } else {
        this.logger.tracedError(
          message,
          errorMessages.NO_USERNAME_IN_MESSAGE
        )
      }
    }
  }

  public setCoordinates(
    coordinates: TelegramBot.Location,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): void {
    const userData = this.activeUserTrack.getActiveUserTrack(this.userName, message)
    if (userData) {
      userData.location = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      }
      this.activeUserTrack.setUserTimeZone(
        userData.userName,
        userData.location,
        message
      )
      this.logger.tracedInfo(
        message,
        coordinatesSetForUser(
          this.userName,
          coordinates.latitude.toString(),
          coordinates.longitude.toString()
        )
      )
    } else {
      this.logger.tracedError(
        message,
        userDataNotFound(this.userName)
      )
    }
  }

  public setNotificationTime(
    notificationTime: string,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): void {
    const userData = this.activeUserTrack.getActiveUserTrack(this.userName, message)
    if (userData) {
      userData.notificationTime = notificationTime
      this.logger.tracedInfo(
        message,
        userNotificationTimeSet(this.userName, notificationTime)
      )
    } else {
      this.logger.tracedError(
        message,
        userDataNotFound(this.userName)
      )
    }
  }

  public getUserData(
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): IActiveUserTrackData | undefined {
    const userData = this.activeUserTrack.getActiveUserTrack(this.userName, message)
    if (!userData) {
      this.logger.tracedError(
        message,
        userDataNotFound(this.userName)
      )
    }
    return userData
  }

  public async saveSubscription(
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    data: IActiveUserTrackData
  ): Promise<void> {
    try {
      await this.db.subscribe(message, data)
      this.userNotificationScheduler.scheduleUserNotification(data)
      this.logger.tracedInfo(
        message,
        subscriptionSavedForUser(this.userName)
      )
    } catch (error) {
      this.logger.tracedError(
        message,
        errorSavingSubscription(this.userName),
        error
      )
    }
  }

  public getState(): IState | undefined {
    return this.stateManager.getCurrentState()
  }

  public async completeSubscription(
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): Promise<void> {
    this.activeUserTrack.deleteActiveUserTrack(this.userName, message)
    await this.userCache.addUser(message)
    this.logger.tracedInfo(
      message,
      subscriptionProcessCompleted(this.userName)
    )
  }

  public completeUserUpdate(
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): void {
    this.activeUserTrack.deleteActiveUserTrack(this.userName, message)
    this.logger.tracedInfo(
      message,
      userUpdateProcessCompleted(this.userName)
    )
  }

  public async sendMessage(
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    text: string,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    options?: { reply_markup: TelegramBot.ReplyKeyboardMarkup }
  ): Promise<void> {
    try {
      const fields = await this.chatIdHandler.handle(message)
      if (!fields.chatID) {
        this.logger.tracedError(
          message,
          errorMessages.ERROR_GETTING_CHAT_ID_FROM_MESSAGE
        )
        return
      }
      await this.botReceiver.sendMessage(
        message,
        fields.chatID,
        text,
        options
      )
      this.logger.tracedInfo(
        message,
        messageSentToUser(this.userName)
      )
    } catch (error) {
      this.logger.tracedError(
        message,
        errorSendingMessage(this.userName),
        error
      )
    }
  }

  public async getUpdateFields(
    message: TelegramBot.CallbackQuery |
    TelegramBot.Message
  ): Promise<IUserMessageWorkingFields> {
    this.chatIdHandler
      .setNext(this.userLocationHandler)
      .setNext(this.userTimeHandler)
    const fields = await this.chatIdHandler
      .handle(message)
    return fields
  }

  public async updateUserLocation(
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    data: IActiveUserTrackData
  ): Promise<void> {
    try {
      await this.db.updateUserLocation(message, data)
      await this.userNotificationScheduler
        .scheduleUserNotificationForExistingUser(data)
      this.logger.tracedInfo(
        message,
        locationUpdatedForUser(this.userName)
      )
    } catch (error) {
      this.logger.tracedError(
        message,
        errorUpdatingLocation(this.userName),
        error
      )
    }
  }

  public async updateUserNotificationTime(
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    data: IActiveUserTrackData
  ): Promise<void> {
    try {
      await this.db.updateUserTime(message, data)
      await this.userNotificationScheduler
        .scheduleUserNotificationForExistingUser(data)
      this.logger.tracedInfo(
        message,
        notificationTimeUpdatedForUser(this.userName)
      )
    } catch (error) {
      this.logger.tracedError(
        message,
        errorUpdatingNotificationTime(this.userName),
        error
      )
    }
  }
}

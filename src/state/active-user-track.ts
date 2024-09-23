import {
  inject,
  injectable
} from 'inversify'
import TelegramBot from 'node-telegram-bot-api'
import { find } from 'geo-tz'
import type {
  IActiveUserTrack,
  IActiveUserTrackData,
  ILogger,
  IMessageFieldsHandler,
  IState,
  ITimers, IUserCoordinates
} from '../interfaces'
import {
  IErrorWithoutAdditionalHandling
} from '../interfaces/i-error-without-additional-handling'
import errorMessages from '../types/errors/error-messages'

import { SERVICE_IDENTIFIER } from '../types/identifiers'
import {
  deletingActiveUserTrackMessage,
  gettingActiveUserTrackMessage, userAlreadyInActiveUsersMessage,
  userSubscriptionAbortedMessage, userSubscriptionMessage
} from '../types/message/interactive-strings'
import runtimeInformation from '../types/utilities/runtime-information'

@injectable()
export class ActiveUserTrack implements IActiveUserTrack {
  private readonly activeUsers = new Map<string, IActiveUserTrackData>()

  public constructor(
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger,
    @inject(SERVICE_IDENTIFIER.UserNameHandler)
    private readonly userNameHandler: IMessageFieldsHandler,
    @inject(SERVICE_IDENTIFIER.ChatIdHandler)
    private readonly chatIdHandler: IMessageFieldsHandler,
    @inject(SERVICE_IDENTIFIER.Timers)
    private readonly timers: ITimers,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    private readonly errorWithoutAdditionalHandling:
    IErrorWithoutAdditionalHandling
  ) {}

  public async setActiveUserTrack(
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    state: IState
  ): Promise<void> {
    try {
      this.logger.tracedInfo(
        message,
        runtimeInformation.SETTING_ACTIVE_USER_TRACK
      )
      this.chatIdHandler
        .setNext(this.userNameHandler)
      const fields = await this.chatIdHandler.handle(message)
      if (!fields.userName || !fields.chatID) {
        this.logger.tracedError(
          message,
          errorMessages.NO_USERNAME_IN_MESSAGE
        )
        this.errorWithoutAdditionalHandling.throw(
          errorMessages.ERROR_IN_ACTIVE_USER_TRACK_SETTING,
          errorMessages.NO_USERNAME_IN_MESSAGE
        )
      } else if (
        this.getActiveUserTrack(
          fields.userName,
          message
        )) {
        this.logger.tracedInfo(
          message,
          userAlreadyInActiveUsersMessage(fields.userName)
        )
        return
      }

      const timer = this.setTrackDownTimer(
        fields.userName,
        message

      )
      const activeUser: IActiveUserTrackData = {
        state: state,
        timer: timer,
        userName: fields.userName,
        chatID: fields.chatID,
      }

      this.activeUsers.set(
        activeUser.userName,
        activeUser
      )
    } catch (error) {
      this.logger.tracedError(
        message,
        error,
        errorMessages.ERROR_IN_ACTIVE_USER_TRACK_SETTING
      )
    }
  }

  public getActiveUserTrack(
    userName: string,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): IActiveUserTrackData
    | undefined {
    this.logger.tracedInfo(
      message,
      gettingActiveUserTrackMessage(userName)
    )
    console.log(this.activeUsers.get(userName))
    return this.activeUsers.get(userName)
  }

  public deleteActiveUserTrack(
    userName: string,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): void {
    this.logger.tracedInfo(
      message,
      deletingActiveUserTrackMessage(userName)
    )
    this.activeUsers.delete(userName)
  }

  public async setUserState(
    userName: string,
    state: IState,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): Promise<void> {
    const activeUser = this.activeUsers.get(userName)
    if (activeUser) {
      activeUser.state = state
      this.activeUsers.set(userName, activeUser)
    } else {
      this.logger.tracedInfo(
        message,
        userSubscriptionMessage(userName)
      )
    }
    await this.setActiveUserTrack(
      message,
      state
    )
  }

  public setUserTimeZone(
    userName: string,
    userLocation: IUserCoordinates,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): void {
    this.logger.tracedInfo(
      message,
      runtimeInformation.SETTING_USER_TIMEZONE
    )
    const activeUser = this.getActiveUserTrack(userName, message)
    if (activeUser) {
      const [userTimeZone] = find(
        userLocation.latitude,
        userLocation.longitude
      )
      if (userTimeZone) {
        activeUser.userTimeZone = userTimeZone
        this.activeUsers.set(userName, activeUser)
      } else {
        this.logger.tracedError(
          message,
          errorMessages.ERROR_IN_SETTING_USER_TIMEZONE
        )
        this.errorWithoutAdditionalHandling.throw(
          errorMessages.ERROR_IN_SETTING_USER_TIMEZONE,
          errorMessages.ERROR_IN_ACTIVE_USER_TRACK_SETTING
        )
      }
    }
  }

  public resetTrackDownTimer(
    userName: string,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): void {
    try {
      this.logger.tracedInfo(
        message,
        runtimeInformation.RESETTING_TRACK_DOWN_TIMER
      )
      const activeUser = this.getActiveUserTrack(userName, message)
      if (activeUser) {
        clearTimeout(activeUser.timer)
        activeUser.timer = this.setTrackDownTimer(userName, message)
        this.activeUsers.set(userName, activeUser)
      }
    } catch (error) {
      this.logger.tracedError(
        message,
        error,
        errorMessages.ERROR_IN_RESET_TRACK_DOWN_TIMER
      )
    }
  }

  private setTrackDownTimer(
    userName: string,
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): NodeJS.Timeout {
    const timer = this.timers.getTrackdownTimer(() => {
      if (this.getActiveUserTrack(userName, message)) {
        this.deleteActiveUserTrack(userName, message)
        this.logger.tracedInfo(
          message,
          userSubscriptionAbortedMessage
        )
      }
    })

    return timer
  }
}

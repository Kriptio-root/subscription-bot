import { PrismaClient } from '@prisma/client'
import {
  injectable,
  inject
} from 'inversify'
import TelegramBot from 'node-telegram-bot-api'
import {
  IActiveUserTrackData,
  IDB,
  ILogger,
  IUser
} from '../../../interfaces'
import errorMessages from '../../../types/errors/error-messages'
import { SERVICE_IDENTIFIER } from '../../../types/identifiers'
import {
  errorInUserSubscribe,
  errorUpdatingLocation,
  locationUpdatedForUser,
  notificationTimeUpdatedForUser,
  userNotFountInDatabase,
  userSubcribed
} from '../../../types/message/interactive-strings'
import runtimeInformation from '../../../types/utilities/runtime-information'
import { ErrorWithoutAdditionalHandling } from '../../errors'

@injectable()
export class PrismaService implements IDB {
  private readonly prisma: PrismaClient

  public constructor(
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    private readonly errorWithoutAdditionalHandling:
    ErrorWithoutAdditionalHandling
  ) {
    this.prisma = new PrismaClient()
  }

  public async connect(): Promise<void> {
    this.logger.info(runtimeInformation.CONNECTING_TO_DATABASE)
    await this.prisma.$connect()
  }

  public async disconnect(): Promise<void> {
    this.logger.info(runtimeInformation.DISCONNECTING_FROM_DATABASE)
    await this.prisma.$disconnect()
  }

  public getClient(): PrismaClient {
    return this.prisma
  }

  public async getSubscription(
    userName: string,
    message?: TelegramBot.CallbackQuery | TelegramBot.Message
  ): Promise<IUser | undefined> {
    if (message) {
      this.logger.tracedInfo(
        message,
        runtimeInformation.GETTING_SUBSCRIPTION,
        userName
      )
    } else {
      this.logger.info(
        runtimeInformation.GETTING_SUBSCRIPTION
      )
    }
    const user = await this.prisma.user.findUnique({ where: { userName: userName, }, })
    if (user) {
      this.logger.info(
        `User ${userName} found in database`,
        userName
      )
      return {
        userName: user.userName,
        chatID: Number(user.chatID),
        location: user.location,
        notificationTime: user.notificationTime,
        userTimeZone: user.userTimeZone,
      }
    }
    this.logger.info(
      userNotFountInDatabase(userName),
      userName
    )
    return undefined
  }

  public async subscribe(
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    data: IActiveUserTrackData
  ): Promise<void> {
    this.logger.tracedInfo(
      message,
      runtimeInformation.SUBSCRIBING_USER,
      data.userName
    )
    try {
      await this.prisma.user.create({
        data: {
          userName: data.userName,
          chatID: BigInt(data.chatID),
          location: data.location!,
          notificationTime: data.notificationTime!,
          userTimeZone: data.userTimeZone!,
        },
      })
      this.logger.tracedInfo(
        message,
        userSubcribed(data.userName),
        data.userName
      )
    } catch (error: unknown) {
      this.logger.tracedError(
        message,
        errorInUserSubscribe(data.userName),
        error
      )
      throw error
    }
  }

  public async unsubscribe(
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    userName: string
  ): Promise<void> {
    this.logger.tracedInfo(
      message,
      runtimeInformation.UNSUBSCRIBING_USER,
      userName
    )
    await this.prisma.user.delete({
      where: {
        userName: userName,
      },
    })
  }

  public async getAllUserNames(): Promise<string[]> {
    this.logger.info(runtimeInformation.FETCHING_ALL_USER_NAMES_FROM_DB)
    try {
      const users = await this.prisma.user.findMany({
        select: {
          userName: true,
        },
      })
      return users
        .map((user) => { return user.userName })
    } catch (error) {
      this.logger.error(errorMessages.ERROR_FETCHING_USER_NAMES, error)
      throw error
    }
  }

  public async updateUserLocation(
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    data: IActiveUserTrackData
  ): Promise<void> {
    this.logger.tracedInfo(
      message,
      runtimeInformation.UPDATING_USER_LOCATION
    )
    try {
      if (!data.userName || !data.location) {
        this.errorWithoutAdditionalHandling.throw(
          errorMessages.ERROR_UPDATING_USER_LOCATION,
          errorMessages.USER_NAME_OR_LOCATION_MISSING
        )
      }

      await this.prisma.user.update({
        where: {
          userName: data.userName,
        },
        data: {
          location: data.location,
          chatID: BigInt(data.chatID),
        },
      })

      this.logger.tracedInfo(
        message,
        locationUpdatedForUser(data.userName)
      )
    } catch (error) {
      this.logger.tracedError(
        message,
        errorUpdatingLocation(data.userName),
        error
      )
      throw error
    }
  }

  public async updateUserTime(
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    data: IActiveUserTrackData
  ): Promise<void> {
    this.logger.tracedInfo(
      message,
      runtimeInformation.UPDATING_USER_NOTIFICATION_TIME
    )
    try {
      if (!data.userName || !data.notificationTime) {
        this.errorWithoutAdditionalHandling.throw(
          errorMessages.ERROR_UPDATING_USER_NOTIFICATION_TIME,
          errorMessages.USER_NAME_OR_TIME_MISSING
        )
      }

      await this.prisma.user.update({
        where: {
          userName: data.userName,
        },
        data: {
          notificationTime: data.notificationTime,
          chatID: BigInt(data.chatID),
        },
      })

      this.logger.tracedInfo(
        message,
        notificationTimeUpdatedForUser(data.userName)
      )
    } catch (error) {
      this.logger.tracedError(
        message,
        errorMessages.ERROR_UPDATING_USER_NOTIFICATION_TIME,
        error
      )
      throw error
    }
  }

  public async getAllUsers(): Promise<IUser[]> {
    this.logger.info(runtimeInformation.FETCHING_ALL_USERS_FROM_DB)
    try {
      const users = await this.prisma.user.findMany()
      return users.map((user) => {
        return {
          userName: user.userName,
          chatID: Number(user.chatID),
          location: user.location,
          notificationTime: user.notificationTime,
          userTimeZone: user.userTimeZone,
        }
      })
    } catch (error) {
      this.logger.error(errorMessages.ERROR_FETCHING_USERS, error)
      throw error
    }
  }
}

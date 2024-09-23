import {
  injectable,
  inject
} from 'inversify'
import { CronJob } from 'cron'
import {
  IActiveUserTrackData,
  IBotReceiver,
  IDB,
  ILogger,
  IRequestHandler,
  IUser,
  IUserNotificationScheduler
} from '../../../interfaces'
import errorMessages from '../../../types/errors/error-messages'
import { SERVICE_IDENTIFIER } from '../../../types/identifiers'
import {
  cancelledNotificationForUser,
  scheduledNotificationForUser,
  sendingNotificationToUser,
  userNotFountInDatabase
} from '../../../types/message/interactive-strings'

@injectable()
export class UserNotificationScheduler implements IUserNotificationScheduler {
  private readonly jobs = new Map<string, CronJob>()

  public constructor(
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IDB)
    private readonly db: IDB,
    @inject(SERVICE_IDENTIFIER.IBotReceiver)
    protected botReceiver: IBotReceiver,
    @inject(SERVICE_IDENTIFIER.IRequestHandler)
    protected requestHandler: IRequestHandler
  ) {}

  public async scheduleNotifications(): Promise<void> {
    try {
      const users = await this.db.getAllUsers()
      users.forEach((user) => {
        this.scheduleUserNotification(user)
      })
    } catch (error: unknown) {
      this.logger.error(
        errorMessages.ERROR_SCHEDULING_NOTIFICATIONS,
        error
      )
    }
  }

  public rescheduleUserNotification(
    user: IActiveUserTrackData | IUser
  ): void {
    const existingJob = this.jobs.get(user.userName)
    if (existingJob) {
      existingJob.stop()
      this.jobs.delete(user.userName)
    }
    this.scheduleUserNotification(user)
  }

  public cancelUserNotification(userName: string): void {
    const job = this.jobs.get(userName)
    if (job) {
      job.stop()
      this.jobs.delete(userName)
      this.logger.info(cancelledNotificationForUser(userName))
    }
  }

  public async scheduleUserNotificationForExistingUser(
    user: IActiveUserTrackData | IUser
  ): Promise<void> {
    const existingUser = await this.db.getSubscription(user.userName)
    if (!existingUser) {
      this.logger.error(
        userNotFountInDatabase(user.userName)
      )
    } else {
      this.rescheduleUserNotification(existingUser)
    }
  }

  public scheduleUserNotification(
    user: IActiveUserTrackData | IUser
  ): void {
    const timeParts = user.notificationTime!.split(':')

    const hour = timeParts[0]!
    const minute = timeParts[1]!

    const cronTime = `${minute} ${hour} * * *`

    const job = new CronJob(
      cronTime,
      async () => {
        await this.sendWeatherNotification(user)
      },
      null,
      true,
      user.userTimeZone
    )

    this.jobs.set(
      user.userName,
      job
    )
    this.logger.info(
      scheduledNotificationForUser(
        user.userName,
        user.notificationTime!,
        user.userTimeZone!
      )
    )
  }

  private async sendWeatherNotification(
    user: IActiveUserTrackData | IUser
  ): Promise<void> {
    const chatId = user.chatID.toString()
    const weatherInfo = await this.requestHandler.handleRequest(user)
    this.logger.info(
      sendingNotificationToUser(user.userName)
    )
    await this.botReceiver.sendNotification(chatId, weatherInfo)
  }
}

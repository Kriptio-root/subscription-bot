import { injectable, inject } from 'inversify'
import {
  IConfiguration,
  ILogger,
  ITimers
} from '../../interfaces'
import errorMessages from '../../types/errors/error-messages'
import { SERVICE_IDENTIFIER } from '../../types/identifiers'
import {
  time
} from '../../types/events/timeConstants'
import runtimeInformation from '../../types/utilities/runtime-information'

@injectable()
export class Timers implements ITimers {
  public constructor(
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IConfiguration)
    private readonly configuration: IConfiguration
  ) {}

  public getTrackdownTimer(
    callback: () => void
  ): NodeJS.Timeout {
    const delayInMilliseconds =
      this.configuration.trackdownTime *
      time.MILLISECONDS_IN_ONE_MINUTE

    return setTimeout(() => {
      this.logger.info(runtimeInformation.TRACKDOWN_TIMER_EXPIRED)
      callback()
    }, delayInMilliseconds)
  }

  public getCacheTTLTimer(
    callback: () => Promise<void>
  ): NodeJS.Timeout {
    const delayInMilliseconds = this.configuration.cacheTimeToLive * time.MILLISECONDS_IN_ONE_HOUR
    return setTimeout(() => {
      this.logger.info(runtimeInformation.CACHE_TTL_TIMER_EXPIRED)
      callback().catch((error: unknown) => {
        this.logger.error(errorMessages.ERROR_IN_SETTING_CACHE_TTL_TIMER, error)
      })
    }, delayInMilliseconds)
  }
}

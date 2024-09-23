import type { IConfiguration } from '../interfaces'

const configuration: IConfiguration = {
  prettyLogging: true,
  prettyLoggerName: 'pino-pretty',
  regularLoggerName: 'pino-regular',
  trackdownTime: 5,
  cacheTimeToLive: 1,
  timeZone: 'UTC',
}

export default configuration

import 'reflect-metadata'
import { container } from './configuration/inversify.config'
import type {
  IBotServiceFactory,
  IBotService,
  ILogger,
  IConfiguration
} from './interfaces'
import errorMessages from './types/errors/error-messages'
import exitCode from './types/errors/exit-code'
import { SERVICE_IDENTIFIER } from './types/identifiers'
import runtimeInformation from './types/utilities/runtime-information'

// eslint-disable-next-line no-void
void (async function start(): Promise<void> {
  const logger: ILogger = container.get<ILogger>(SERVICE_IDENTIFIER.ILogger)
  process.env.TZ = container
    .get<IConfiguration>(SERVICE_IDENTIFIER.IConfiguration).timeZone
  try {
    logger.info(runtimeInformation.STARTING_CHAT_BOT)
    const botServiceFactory: IBotServiceFactory =
      container.get<IBotServiceFactory>(SERVICE_IDENTIFIER.IBotServiceFactory)
    const botService: IBotService = botServiceFactory.createBotService()
    await botService.initialize()
    logger.info(runtimeInformation.STARTING_CHAT_BOT, runtimeInformation.DONE)
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(errorMessages.FAILED_START_BOT, error.message)
    } else {
      logger.error(errorMessages.FAILED_START_BOT, errorMessages.UNKNOWN)
    }
    process.exit(exitCode.FAILURE)
  }
}())

import pino from 'pino'
import { injectable } from 'inversify'
import 'reflect-metadata'
import TelegramBot from 'node-telegram-bot-api'
import pinoPrettyConfig from '../../types/logger/pino-pretty-config'
import pinoRegularConfig from '../../types/logger/pino-regular-config'
import configuration from '../../configuration/configuration'
import type { ILogger } from '../../interfaces'
import LoggerFormatingConstants from '../../types/logger/logger-formating-constants'
import constants from '../../types/message/constants'

@injectable()
export class PinoLogger implements ILogger {
  private readonly logger: pino.Logger

  public constructor() {
    this.logger = pino({
      transport: {
        target: configuration.prettyLogging
          ? configuration.prettyLoggerName
          : configuration.regularLoggerName,
        options: configuration.prettyLogging
          ? { ...pinoPrettyConfig, }
          : { ...pinoRegularConfig, },
      },
    })
  }

  public error(message: string, ...args: unknown[]): void {
    this.logger.error({ ...args, }, message)
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.info({ ...args, }, message)
  }

  public info(...args: unknown[]): void {
    this.logger.info(
      [...args]
        .slice(LoggerFormatingConstants.FIRST_MEMBER_OFFSET, args.length)
        .join(' ')
    )
  }

  public tracedInfo(
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    ...args: unknown[]
  ): void {
    if (constants.MESSAGE_ID in message) {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      this.logger.info(
        this.createTracedMessage(message.message_id, args, message.text)
      )
    } else if (constants.ID in message) {
      this.logger.info(this.createTracedMessage(message.id, args))
    } else {
      this.logger.info(
        [...args]
          .slice(LoggerFormatingConstants.FIRST_MEMBER_OFFSET, args.length)
          .join(' ')
      )
    }
  }

  public tracedError(
    message: TelegramBot.CallbackQuery | TelegramBot.Message,
    ...args: unknown[]
  ): void {
    if (constants.MESSAGE_ID in message) {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      this.logger.error(
        this.createTracedMessage(message.message_id, args, message.text)
      )
    } else if (constants.ID in message) {
      this.logger.error(this.createTracedMessage(message.id, args))
    } else {
      this.logger.error(
        [...args]
          .slice(LoggerFormatingConstants.FIRST_MEMBER_OFFSET, args.length)
          .join(' ')
      )
    }
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args)
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  protected createTracedMessage(
    id: number | string,
    additionalText: unknown[],
    messageText: string = LoggerFormatingConstants.DEFAULT_MESSAGE_TEXT
  ): string {
    return (
      (id as unknown as string) +
      LoggerFormatingConstants.SPACING +
      messageText +
      LoggerFormatingConstants.SPACING +
      [...additionalText]
        .slice(
          LoggerFormatingConstants.FIRST_MEMBER_OFFSET,
          additionalText.length
        )
        .join(LoggerFormatingConstants.SPACING)
    )
  }
}

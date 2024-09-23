import { inject, injectable } from 'inversify'
import {
  ILogger,
  IResponseParser, IWeatherResponseData
} from '../../../interfaces'
import {
  IErrorWithoutAdditionalHandling
} from '../../../interfaces/i-error-without-additional-handling'
import errorMessages from '../../../types/errors/error-messages'
import { SERVICE_IDENTIFIER } from '../../../types/identifiers'
import loggerMessages from '../../../types/logger/logger-messages'

@injectable()
export class ResponseParser implements IResponseParser {
  public constructor(
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    protected errorWithoutAdditionalHandling: IErrorWithoutAdditionalHandling
  ) {}

  public parseResponse(
    response: string
  ): IWeatherResponseData | undefined {
    try {
      this.logger.info(
        loggerMessages.RESPONSE_PARSING_START,
        response
      )

      return this.parseResponseToJSON(response)
    } catch (error: unknown) {
      this.logger.error(
        errorMessages.ERROR_PARSING_RESPONSE,
        response
      )
      return this.errorWithoutAdditionalHandling.throw(
        errorMessages.ERROR_PARSING_RESPONSE,
        error
      )
    }
  }

  private parseResponseToJSON(
    response: string
  ): IWeatherResponseData | undefined {
    if (!response) {
      return undefined
    }
    return JSON.parse(response) as IWeatherResponseData
  }
}

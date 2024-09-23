import { inject, injectable } from 'inversify'
import {
  ILogger,
  IResponseFormatter, IWeatherResponseData
} from '../../../interfaces'
import {
  IErrorWithoutAdditionalHandling
} from '../../../interfaces/i-error-without-additional-handling'
import errorMessages from '../../../types/errors/error-messages'
import { SERVICE_IDENTIFIER } from '../../../types/identifiers'
import loggerMessages from '../../../types/logger/logger-messages'

@injectable()
export class ResponseFormatter implements IResponseFormatter {
  public constructor(
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    private readonly errorWithoutAdditionalHandling:
    IErrorWithoutAdditionalHandling
  ) {}

  public formatResponse(responseData: IWeatherResponseData): string {
    try {
      this.logger.info(
        loggerMessages.RESPONSE_FORMATTING_START,
        responseData
      )
      this.createReplyMessage(responseData)
      return this.createReplyMessage(responseData)
    } catch (error) {
      this.logger.info(
        errorMessages.ERROR_FORMATTING_RESPONSE,
        error
      )
      return this.errorWithoutAdditionalHandling.throw(
        errorMessages.ERROR_FORMATTING_RESPONSE_MESSAGE,
        errorMessages.ERROR_FORMATTING_RESPONSE
      )
    }
  }

  private createReplyMessage(responseData: IWeatherResponseData): string {
    return `It is ${responseData.weather[0]!.description} in your region,\n
    with a temperature of ${Math.ceil(responseData.main.temp).toString()} degrees,\n
    feels like ${Math.ceil(responseData.main.feels_like).toString()} degrees,\n
    humidity is ${responseData.main.humidity.toString()},\n`
  }
}

import { injectable, inject } from 'inversify'
import https from 'https'
import {
  ILogger,
  IRequestProcessor,
  IResponseFormatter, IResponseParser
  // IResponseParser
} from '../../../interfaces'
import {
  IErrorWithoutAdditionalHandling
} from '../../../interfaces/i-error-without-additional-handling'
import errorMessages from '../../../types/errors/error-messages'
import fetchEvents from '../../../types/events/fetch-events'
import { SERVICE_IDENTIFIER } from '../../../types/identifiers'
import loggerMessages from '../../../types/logger/logger-messages'
import {
  formattedDataMessage,
  getHTTPStatusMessage,
  rawDataReceivedMessage
} from '../../../types/message/interactive-strings'
import utilities from '../../../types/utilities/utilities'
import {
  ErrorInstanceAdapter
} from '../../errors/error-instance-typescript-adapter'

@injectable()
export class RequestProcessor implements IRequestProcessor {
  public constructor(
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IResponseFormatter)
    private readonly responseFormatter: IResponseFormatter,
    @inject(SERVICE_IDENTIFIER.IResponseParser)
    private readonly responseParser: IResponseParser,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    private readonly errorWithoutAdditionalHandling:
    IErrorWithoutAdditionalHandling
  ) {}

  public async fetchDataRequest(
    formattedEndpoint: string
  ): Promise<string> {
    try {
      this.logger.info(
        loggerMessages.FETCHING_DATA
      )
      return await this.makeRequest(formattedEndpoint)
    } catch (error) {
      this.logger.error(
        errorMessages.ERROR_FETCHING_DATA,
        error
      )
      return this.errorWithoutAdditionalHandling.throw(
        errorMessages.ERROR_FETCHING_DATA,
        error
      )
    }
  }

  private async makeRequest(
    url: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          let data = ''
          let statusCode: string
          if (res.statusCode) {
            statusCode = res.statusCode.toString()
          } else {
            statusCode = utilities.UNDEFINED
          }
          this.logger.info(getHTTPStatusMessage(statusCode))
          res.on(fetchEvents.DATA, (chunk) => {
            data += chunk as string
          })

          res.on(fetchEvents.END, () => {
            try {
              this.logger.info(rawDataReceivedMessage(data))
              const parsedData = this.responseParser.parseResponse(data)
              this.logger.info(loggerMessages.PARSING_DATA)
              if (!parsedData) {
                this.errorWithoutAdditionalHandling.throw(
                  errorMessages.ERROR_PARSING_RESPONSE,
                  errorMessages.ERROR_PARSING_RESPONSE
                )
              }
              const formattedData = this.responseFormatter.formatResponse(parsedData)
              this.logger.info(formattedDataMessage(formattedData))
              resolve(formattedData)
            } catch (error) {
              this.logger.error(
                errorMessages.ERROR_PARSING_RESPONSE,
                error
              )
              reject(new ErrorInstanceAdapter(
                errorMessages.ERROR_PARSING_RESPONSE,
                error
              ))
            }
          })
        })
        .on(fetchEvents.ERROR, (error) => {
          reject(new ErrorInstanceAdapter(
            errorMessages.ERROR_HTTP_REQUEST,
            error
          ))
        })
    })
  }
}

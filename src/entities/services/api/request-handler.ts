import { inject, injectable } from 'inversify'
import {
  ILogger,
  IRequestProcessor,
  IRequestHandler,
  IUser,
  IActiveUserTrackData
} from '../../../interfaces'
import {
  IErrorWithoutAdditionalHandling
} from '../../../interfaces/i-error-without-additional-handling'
import errorMessages from '../../../types/errors/error-messages'
import { SERVICE_IDENTIFIER } from '../../../types/identifiers'
import runtimeInformation from '../../../types/utilities/runtime-information'
import { ApiEndpointComposer } from './api-endpoint-composer'

@injectable()
export class RequestHandler implements IRequestHandler {
  private formattedApiEndpoint: string | undefined

  public constructor(
    @inject(SERVICE_IDENTIFIER.IApiEndpointComposer)
    private readonly apiEndpointComposer: ApiEndpointComposer,
    @inject(SERVICE_IDENTIFIER.IRequestProcessor)
    private readonly requestProcessor: IRequestProcessor,
    @inject(SERVICE_IDENTIFIER.ILogger)
    private readonly logger: ILogger,
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    protected errorWithoutAdditionalHandling: IErrorWithoutAdditionalHandling
  ) {}

  public async handleRequest(
    user: IActiveUserTrackData | IUser
  ): Promise<string> {
    try {
      this.setFormattedApiEndpoint(user)
      this.logger.info(
        runtimeInformation.FORMATTED_API_ENDPOINT,
        this.formattedApiEndpoint
      )
      const formattedMessage =
          await this.requestProcessor
            .fetchDataRequest(
              this.formattedApiEndpoint!
            )
      return formattedMessage
    } catch (error) {
      this.logger.error(
        errorMessages.ERROR_HANDLING_REQUEST,
        error
      )
      return this.errorWithoutAdditionalHandling.throw(
        errorMessages.ERROR_HANDLING_REQUEST,
        error
      )
    }
  }

  private setFormattedApiEndpoint(
    user: IActiveUserTrackData | IUser
  ): void {
    try {
      this.formattedApiEndpoint = this.apiEndpointComposer.compose(
        user.location!
      )
    } catch (error: unknown) {
      this.logger.error(
        errorMessages.ERROR_SETTING_API_ENDPOINT,
        error
      )
      this.errorWithoutAdditionalHandling.throw(
        errorMessages.ERROR_SETTING_API_ENDPOINT,
        error
      )
    }
  }
}

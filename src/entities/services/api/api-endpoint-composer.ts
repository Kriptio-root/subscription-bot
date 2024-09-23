import { inject, injectable } from 'inversify'
import {
  IApiEndpointComposer,
  IUserCoordinates
} from '../../../interfaces'
import {
  IErrorWithoutAdditionalHandling
} from '../../../interfaces/i-error-without-additional-handling'
import endpoint from '../../../types/api/endpoint'
import errorMessages from '../../../types/errors/error-messages'
import { SERVICE_IDENTIFIER } from '../../../types/identifiers'

@injectable()
export class ApiEndpointComposer implements IApiEndpointComposer {
  public constructor(
    @inject(SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling)
    private readonly errorWithoutAdditionalHandling:
    IErrorWithoutAdditionalHandling
  ) {}

  public compose(userCoordinates: IUserCoordinates): string {
    try {
      const formattedEndpoint: string = endpoint.protocol.concat(
        endpoint.weatherEndpoint,
        endpoint.requestType,
        endpoint.version,
        endpoint.requestFor,
        endpoint.latitudePrefix,
        userCoordinates.latitude.toString(),
        endpoint.longitudePrefix,
        userCoordinates.longitude.toString(),
        endpoint.keyPrefix,
        process.env.OPEN_WEATHER_MAP_API_KEY,
        endpoint.units
      )
      return formattedEndpoint
    } catch (error: unknown) {
      return this.errorWithoutAdditionalHandling.throw(
        errorMessages.ERROR_COMPOSING_API_ENDPOINT,
        error
      )
    }
  }
}

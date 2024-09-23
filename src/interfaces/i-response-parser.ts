import type { IWeatherResponseData } from './i-weather-response-data'

export interface IResponseParser {
  parseResponse: (
    response: string
  ) => IWeatherResponseData | undefined
}

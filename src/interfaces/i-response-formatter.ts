import type { IWeatherResponseData } from '../interfaces'

export interface IResponseFormatter {
  formatResponse: (
    responseData: IWeatherResponseData
  ) => string
}

import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class ErrorInstanceAdapter extends Error {
  public constructor(message: string, error: unknown) {
    let errorMessage: string

    if (error instanceof TypeError) {
      errorMessage = `${message}: ${error.message}`
    } else {
      errorMessage = `${message}: ${String(error)}`
    }

    super(errorMessage)
    this.name = error instanceof TypeError ? error.name : 'ErrorInstanceAdapter'

    Object.setPrototypeOf(this, ErrorInstanceAdapter.prototype)

    Error.captureStackTrace(this, ErrorInstanceAdapter)
  }

  public static throw(message: string, error: unknown): never {
    throw new ErrorInstanceAdapter(message, error)
  }
}

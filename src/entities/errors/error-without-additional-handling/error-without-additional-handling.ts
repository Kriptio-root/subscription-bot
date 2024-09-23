import { injectable } from 'inversify'
import {
  IErrorWithoutAdditionalHandling
} from '../../../interfaces/i-error-without-additional-handling'
import { ErrorInstanceAdapter } from '../error-instance-typescript-adapter'
import 'reflect-metadata'

@injectable()
export class ErrorWithoutAdditionalHandling
implements IErrorWithoutAdditionalHandling {
  public throw(message: string, error: unknown): never {
    throw new ErrorInstanceAdapter(message, error)
  }
}

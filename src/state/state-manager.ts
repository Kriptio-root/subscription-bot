import { injectable, inject } from 'inversify'
import TelegramBot from 'node-telegram-bot-api'
import {
  IState,
  IStateManager,
  IUserContext
} from '../interfaces'
import { SERVICE_IDENTIFIER } from '../types/identifiers'

@injectable()
export class StateManager implements IStateManager {
  private currentState: IState | undefined

  public constructor(
    @inject(SERVICE_IDENTIFIER.InitialUserState)
    private readonly initialUserState: IState
  ) {}

  public setState(
    state: IState,
    userContext: IUserContext
  ): void {
    this.currentState = state
    this.currentState.setContext(userContext)
  }

  public async handleInput(
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ): Promise<void> {
    if (!this.currentState) {
      await this.initialUserState.handleInput(message)
      return
    }
    await this.currentState.handleInput(message)
  }

  public getCurrentState(): IState | undefined {
    return this.currentState
  }

  public initializeState(context: IUserContext): void {
    this.currentState = this.initialUserState
    this.currentState.setContext(context)
  }
}

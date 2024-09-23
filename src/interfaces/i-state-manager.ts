import type TelegramBot from 'node-telegram-bot-api'
import type { IState } from './i-state'
import type { IUserContext } from './i-user-context'

export interface IStateManager {
  setState: (
    state: IState,
    userContext: IUserContext
  ) => void;

  handleInput: (
    message: TelegramBot.CallbackQuery | TelegramBot.Message
  ) => Promise<void>;

  initializeState: (context: IUserContext) => void;

  getCurrentState: () => IState | undefined
}

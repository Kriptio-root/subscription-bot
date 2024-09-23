import type { SendMessageOptions } from 'node-telegram-bot-api'

export interface ISendMessageComposer {
  composeMessageOptions: (
    ...options: SendMessageOptions[]
  ) => SendMessageOptions
}

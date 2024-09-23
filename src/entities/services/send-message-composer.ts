import type { SendMessageOptions } from 'node-telegram-bot-api'
import { injectable } from 'inversify'
import type { ISendMessageComposer } from '../../interfaces'
import 'reflect-metadata'

@injectable()
export class SendMessageComposer implements ISendMessageComposer {
  // eslint-disable-next-line @stylistic/max-len,@typescript-eslint/class-methods-use-this
  public composeMessageOptions(
    ...options: SendMessageOptions[]
  ): SendMessageOptions {
    const messageOptions: SendMessageOptions = {}
    options.forEach((option: SendMessageOptions): void => {
      Object.assign(messageOptions, option)
    })
    return messageOptions
  }
}

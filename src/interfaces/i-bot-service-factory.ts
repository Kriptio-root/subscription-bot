import type { IBotService } from './index'

export interface IBotServiceFactory {
  createBotService: () => IBotService
}

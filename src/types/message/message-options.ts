/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

import type { SendMessageOptions } from 'node-telegram-bot-api'

interface IParseModeOptions {
  MarkdownV2: SendMessageOptions;
  HTML: SendMessageOptions
}

interface IDisableWebPagePreviewOptions {
  TRUE: SendMessageOptions;
  FALSE: SendMessageOptions
}
export const parseMode: IParseModeOptions = {
  MarkdownV2: {
    parse_mode: 'MarkdownV2',
  },
  HTML: {
    parse_mode: 'HTML',
  },
}

export const disableWebPagePreview: IDisableWebPagePreviewOptions = {
  TRUE: {
    disable_web_page_preview: true,
  },
  FALSE: {
    disable_web_page_preview: false,
  },
}

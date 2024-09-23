/* eslint-disable @typescript-eslint/naming-convention */
import type {
  InlineKeyboardButton,
  KeyboardButton
} from 'node-telegram-bot-api'

export const getUserGeolocationButton: KeyboardButton = {
  text: 'Send geolocation',
  request_location: true,
} as const

export const subscribeButton: InlineKeyboardButton = {
  text: 'Subscribe',
  callback_data: '/subscribe',
}

export const updateLocationButton: InlineKeyboardButton = {
  text: 'Update location',
  callback_data: '/updatelocation',
}

export const updateTimeButton: InlineKeyboardButton = {
  text: 'Update time',
  callback_data: '/updatetime',
}

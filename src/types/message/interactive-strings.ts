type InteractiveString = (...args: readonly string[]) => string

export const getWelcomeMessage: InteractiveString = (name: string): string => {
  return `Welcome to my telegram bot ${name}!`
}

export const getHTTPStatusMessage: InteractiveString = (statusCode: string): string => {
  return `HTTP Status: ${statusCode}`
}
export const rawDataReceivedMessage: InteractiveString = (data: string): string => {
  return `Raw data received: ${data}`
}
export const formattedDataMessage: InteractiveString = (formattedData: string): string => {
  return `Formatted data: ${formattedData}`
}
export const userSubscriptionAbortedMessage: InteractiveString = (userName: string): string => {
  return `User ${userName} subscription aborted due to inactivity`
}

export const gettingActiveUserTrackMessage: InteractiveString = (telegramID: string): string => {
  return `Getting active user track for ${telegramID}`
}
export const deletingActiveUserTrackMessage: InteractiveString = (telegramID: string): string => {
  return `Deleting active user track for ${telegramID}`
}

export const userSubscriptionMessage: InteractiveString = (userName: string): string => {
  return `User ${userName} not in the active users list, setting up a new subscription`
}

export const userAlreadyInActiveUsersMessage: InteractiveString = (userName: string): string => {
  return `User ${userName} is already in the active users list`
}

export const subscriptionSavedForUser: InteractiveString = (userName: string): string => {
  return `Subscription saved for user ${userName}`
}

export const userContextTransitionTo: InteractiveString = (state: string): string => {
  return `UserContext: Transition to ${state}`
}

export const coordinatesSetForUser: InteractiveString = (
  userName: string,
  latitude: string,
  longitude: string
): string => {
  return `Coordinates set for user ${userName}:
         [${latitude},
         ${longitude}]`
}

export const userDataNotFound: InteractiveString = (userName: string): string => {
  return `User data not found for ${userName}`
}

export const userNotificationTimeSet: InteractiveString = (
  userName: string,
  notificationTime: string
): string => {
  return `Notification time set for user ${userName}: ${notificationTime}`
}

export const errorSavingSubscription: InteractiveString = (userName: string): string => {
  return `Error saving subscription for user ${userName}`
}

export const subscriptionProcessCompleted: InteractiveString = (userName: string): string => {
  return `Subscription process completed for user ${userName}`
}

export const userUpdateProcessCompleted: InteractiveString = (userName: string): string => {
  return `User update process completed for user ${userName}`
}

export const messageSentToUser: InteractiveString = (userName: string): string => {
  return `Message sent to user ${userName}`
}

export const errorSendingMessage: InteractiveString = (userName: string): string => {
  return `Error sending message to user ${userName}`
}

export const locationUpdatedForUser: InteractiveString = (userName: string): string => {
  return `Location updated for user ${userName}`
}

export const errorUpdatingLocation: InteractiveString = (userName: string): string => {
  return `Error updating location for user ${userName}`
}

export const notificationTimeUpdatedForUser: InteractiveString = (userName: string): string => {
  return `Notification time updated for user ${userName}`
}

export const errorUpdatingNotificationTime: InteractiveString = (userName: string): string => {
  return `Error updating notification time for user ${userName}`
}

export const cancelledNotificationForUser: InteractiveString = (userName: string): string => {
  return `Cancelled notification for user ${userName}`
}

export const userNotFountInDatabase: InteractiveString = (userName: string): string => {
  return `User ${userName} not found in database`
}

export const scheduledNotificationForUser: InteractiveString = (
  userName: string,
  notificationTime: string,
  userTimeZone: string
): string => {
  return `Scheduled notification for user ${userName} at ${notificationTime} on their timezone(${userTimeZone})`
}

export const sendingNotificationToUser: InteractiveString = (userName: string): string => {
  return `Sending notification to user ${userName}`
}

export const userSubcribed: InteractiveString = (userName: string): string => {
  return `User ${userName} subscribed`
}

export const errorInUserSubscribe: InteractiveString = (userName: string): string => {
  return `Error in user ${userName} subscribe`
}

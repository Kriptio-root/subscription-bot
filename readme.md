# Subscription Bot

## Description
Telegram bot where users can subscribe to weather forecast notification. 
Every day at the chosen time at UTC timezone this bot sends what weather is 
expected today.

## Requirements
### Functional requirements:
1. User can subscribe to the weather forecast.
2. User can unsubscribe from the weather forecast.
3. User can update the time when he wants to receive the weather forecast.
4. User can update his location.
5. User can receive the weather forecast in his location every day at the 
   chosen time.


### Non-functional requirements:
1. The bot should be implemented using the Telegram Bot API.
2. The bot should use MongoDB for data storage.
3. Time should use UTC timezone.
4. Time should be implemented using the process.env.TZ variable.
5. The bot should use the OpenWeatherMap API to get the weather forecast.
6. The bot should use the cron library to schedule the sending of the weather 
   forecast.
7. Cron and telegram bot should run in one process - to block application 
   scalability.

## How to use

1. Start the bot by sending `/start` command.
2. Send `/subscribe` command to subscribe to the weather forecast.
3. Send `/unsubscribe` command to unsubscribe from the weather forecast.
4. Send `/update_time` command to update the time when you want to receive the 
   weather forecast.
5. Send `/update_location` command to update your location.

## Commands description

1. `/start` - Sending to user greeting message and possible commands buttons.
2. `/subscribe` - Subscribing to the weather forecast.Running chain of 
   questions to get the location and time when user wants to receive the 
   weather forecast.
3. `/unsubscribe` - Unsubscribing from the weather forecast.
4. `/update_time` - Updating the time when user wants to receive the weather 
   forecast.
5. `/update_location` - Updating the user location to get forecast in 
   updated location.

## Database Schema

The bot stores the user data in the MongoDB database.

### User schema

#### Model User
- telegram_id - Uniq Telegram user id.
- location - User location.
- notification_time - Time when user wants to receive the weather forecast.
<br>
<br>

```
model User {
telegram_id      String   @id @map("_id")
location         Location
notification_time String
}

type Location {
lat Float
lon Float
}
```
## Sequence diagram

### Subscribe

<img title="subscreibe" alt="Subscribe sequance diagram" src="documentation/img/subscribe.png">

### Unsubscribe

<img title="Unsubscreibe" alt="Unsubscreibe sequance diagram" src="documentation/img/unsubscribe.png">

### Update location
<img title="updateLocation" alt="updateLocation sequance diagram" src="documentation/img/update-location.png">

### Update time
<img title="updateTime" alt="updateTime sequance diagram" src="documentation/img/update-time.png">

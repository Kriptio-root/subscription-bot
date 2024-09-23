/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
declare global {
  namespace api {}
  const console: Console
}

namespace NodeJS {
  interface ProcessEnv {
    TELEGRAM_TOKEN: string;
    OPEN_WEATHER_MAP_API_KEY: string;
    DATABASE_URL: string
  }
}

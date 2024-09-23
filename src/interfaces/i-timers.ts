export interface ITimers {
  getCacheTTLTimer: (
    callback: () => Promise<void>
  ) => NodeJS.Timeout;
  getTrackdownTimer: (
    callback: () => void,
  ) => NodeJS.Timeout
}

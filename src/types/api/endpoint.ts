// Endpoint for the OpenWeatherMap API
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
const endpoint = {
  protocol: 'https://',
  weatherEndpoint: 'api.openweathermap.org/',
  requestType: 'data/',
  version: '2.5/',
  requestFor: 'weather?',
  latitudePrefix: 'lat=',
  longitudePrefix: '&lon=',
  keyPrefix: '&appid=',
  units: '&units=metric',
}
export default endpoint

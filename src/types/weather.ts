export type WeatherCondition = {
  main: string;
  description: string;
  iconName: 'sun' | 'moon' | 'cloud-sun' | 'cloud-moon' | 'cloud' | 'cloud-rain' | 'cloud-drizzle' | 'cloud-lightning' | 'snowflake' | 'cloud-fog';
  bgImage: string;
  accentColor: string;
};

export type CurrentWeather = {
  cityName: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  tempC: number;
  feelsLikeC: number;
  tempF: number;
  feelsLikeF: number;
  humidity: number;
  pressure: number;
  windSpeedKmh: number;
  windSpeedMph: number;
  windDirectionDeg: number;
  windDirectionText: string;
  visibilityKm: number;
  visibilityMiles: number;
  uvIndex: number;
  uvDescription: string;
  rainChance: number;
  condition: WeatherCondition;
  isDay: boolean;
  sunriseTime: string;
  sunsetTime: string;
  timezone: string;
  updatedAt: string;
};

export type HourlyForecastItem = {
  time: string;
  hourText: string;
  tempC: number;
  tempF: number;
  condition: WeatherCondition;
  rainChance: number;
  isDay: boolean;
};

export type DailyForecastItem = {
  date: string;
  dayName: string;
  minTempC: number;
  maxTempC: number;
  minTempF: number;
  maxTempF: number;
  condition: WeatherCondition;
  rainChance: number;
  sunriseTime: string;
  sunsetTime: string;
  uvIndex: number;
};

export type FullWeatherData = {
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  source: 'open-meteo' | 'open-weather';
};

export type GeoLocationResult = {
  name: string;
  country: string;
  countryCode: string;
  admin1?: string;
  latitude: number;
  longitude: number;
};

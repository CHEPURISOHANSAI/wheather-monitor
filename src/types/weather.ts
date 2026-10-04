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

export type AirQualityData = {
  aqi: number;
  category: "Good" | "Moderate" | "Unhealthy for Sensitive Groups" | "Unhealthy" | "Very Unhealthy" | "Hazardous";
  color: string;
  advice: string;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
};

export type AstronomyData = {
  sunriseTime: string;
  sunsetTime: string;
  dayLengthText: string;
  sunProgressPercent: number;
  isDay: boolean;
  moonPhaseName: string;
  moonIlluminationPercent: number;
};

export type WeatherInsight = {
  id: string;
  type: "umbrella" | "sunscreen" | "clothing" | "wind" | "sport" | "air";
  title: string;
  description: string;
  severity: "info" | "advisory" | "warning";
};

export type FullWeatherData = {
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality?: AirQualityData;
  astronomy?: AstronomyData;
  insights?: WeatherInsight[];
  source: "open-meteo" | "open-weather";
};

export type GeoLocationResult = {
  name: string;
  country: string;
  countryCode: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  label?: string;
};

import {
  CurrentWeather,
  DailyForecastItem,
  FullWeatherData,
  GeoLocationResult,
  HourlyForecastItem,
  WeatherCondition,
} from "../types/weather";

const WEATHER_WALLPAPERS = {
  clearDay:
    "https://images.unsplash.com/photo-1522011916481-b7f27c0bf69b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=85&w=1600",
  clearNight:
    "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=85&w=1600",
  cloudsDay:
    "https://images.unsplash.com/photo-1534088568595-a066f410bcda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=85&w=1600",
  cloudsNight:
    "https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=85&w=1600",
  rain:
    "https://images.unsplash.com/photo-1519692933481-e162a57d6721?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=85&w=1600",
  thunderstorm:
    "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=85&w=1600",
  snow:
    "https://images.unsplash.com/photo-1517299321909-be09a53827ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=85&w=1600",
  fog:
    "https://images.unsplash.com/photo-1487621167305-5d248087c724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=85&w=1600",
};

export function getWmoCondition(code: number, isDay = true): WeatherCondition {
  switch (code) {
    case 0:
      return {
        main: "Clear",
        description: isDay ? "Sunny and Clear" : "Clear Night Sky",
        iconName: isDay ? "sun" : "moon",
        bgImage: isDay ? WEATHER_WALLPAPERS.clearDay : WEATHER_WALLPAPERS.clearNight,
        accentColor: "#e9ff74",
      };
    case 1:
      return {
        main: "Mainly Clear",
        description: isDay ? "Mostly Sunny" : "Mostly Clear",
        iconName: isDay ? "cloud-sun" : "cloud-moon",
        bgImage: isDay ? WEATHER_WALLPAPERS.clearDay : WEATHER_WALLPAPERS.clearNight,
        accentColor: "#f7e57c",
      };
    case 2:
      return {
        main: "Partly Cloudy",
        description: "Partly Cloudy",
        iconName: isDay ? "cloud-sun" : "cloud-moon",
        bgImage: isDay ? WEATHER_WALLPAPERS.cloudsDay : WEATHER_WALLPAPERS.cloudsNight,
        accentColor: "#aee2ff",
      };
    case 3:
      return {
        main: "Overcast",
        description: "Overcast Skies",
        iconName: "cloud",
        bgImage: isDay ? WEATHER_WALLPAPERS.cloudsDay : WEATHER_WALLPAPERS.cloudsNight,
        accentColor: "#c2d1c9",
      };
    case 45:
    case 48:
      return {
        main: "Fog",
        description: code === 48 ? "Depositing Rime Fog" : "Foggy Mist",
        iconName: "cloud-fog",
        bgImage: WEATHER_WALLPAPERS.fog,
        accentColor: "#d2d8d5",
      };
    case 51:
    case 53:
    case 55:
      return {
        main: "Drizzle",
        description: code === 51 ? "Light Drizzle" : code === 53 ? "Moderate Drizzle" : "Heavy Drizzle",
        iconName: "cloud-drizzle",
        bgImage: WEATHER_WALLPAPERS.rain,
        accentColor: "#74d4ff",
      };
    case 61:
    case 63:
    case 65:
      return {
        main: "Rain",
        description: code === 61 ? "Light Rain" : code === 63 ? "Moderate Rain" : "Heavy Rainfall",
        iconName: "cloud-rain",
        bgImage: WEATHER_WALLPAPERS.rain,
        accentColor: "#56c2f5",
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        main: "Snow",
        description: code === 71 ? "Light Snow" : code === 73 ? "Moderate Snow" : "Heavy Snowfall",
        iconName: "snowflake",
        bgImage: WEATHER_WALLPAPERS.snow,
        accentColor: "#e0f2fe",
      };
    case 80:
    case 81:
    case 82:
      return {
        main: "Showers",
        description: code === 80 ? "Light Showers" : code === 81 ? "Moderate Rain Showers" : "Violent Showers",
        iconName: "cloud-rain",
        bgImage: WEATHER_WALLPAPERS.rain,
        accentColor: "#6ee7b7",
      };
    case 85:
    case 86:
      return {
        main: "Snow Showers",
        description: "Scattered Snow Showers",
        iconName: "snowflake",
        bgImage: WEATHER_WALLPAPERS.snow,
        accentColor: "#dbeafe",
      };
    case 95:
    case 96:
    case 99:
      return {
        main: "Thunderstorm",
        description: code === 95 ? "Thunderstorm" : "Thunderstorm with Hail",
        iconName: "cloud-lightning",
        bgImage: WEATHER_WALLPAPERS.thunderstorm,
        accentColor: "#facc15",
      };
    default:
      return {
        main: "Cloudy",
        description: "Scattered Clouds",
        iconName: isDay ? "cloud-sun" : "cloud-moon",
        bgImage: isDay ? WEATHER_WALLPAPERS.cloudsDay : WEATHER_WALLPAPERS.cloudsNight,
        accentColor: "#e9ff74",
      };
  }
}

export function degToCardinal(deg: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

export function cToF(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function getUvCategory(uv: number): string {
  if (uv < 3) return "Low";
  if (uv < 6) return "Moderate";
  if (uv < 8) return "High";
  if (uv < 11) return "Very High";
  return "Extreme";
}

export async function searchCities(query: string): Promise<GeoLocationResult[]> {
  const clean = query.trim();
  if (!clean || clean.length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    clean
  )}&count=6&language=en&format=json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to search cities");
  const data = await res.json();

  if (!data.results || !Array.isArray(data.results)) {
    return [];
  }

  return data.results.map((item: any) => ({
    name: item.name,
    country: item.country || "",
    countryCode: item.country_code || "",
    admin1: item.admin1 || "",
    latitude: item.latitude,
    longitude: item.longitude,
  }));
}

export async function reverseGeocode(lat: number, lon: number): Promise<{ name: string; country: string }> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`;
    const res = await fetch(url, { headers: { "User-Agent": "AtmosWeatherApp/1.0" } });
    if (res.ok) {
      const data = await res.json();
      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.county ||
        "Current Location";
      const country = data.address?.country || "";
      return { name: city, country };
    }
  } catch {
    // fallback
  }
  return { name: "Current Location", country: "" };
}

export async function fetchWeatherFromOpenMeteo(
  lat: number,
  lon: number,
  locationName: string,
  country: string
): Promise<FullWeatherData> {
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;

  const res = await fetch(forecastUrl);
  if (!res.ok) {
    throw new Error("Unable to fetch weather forecast right now. Please try again.");
  }

  const data = await res.json();
  const current = data.current;
  const isDay = current.is_day === 1;
  const condition = getWmoCondition(current.weather_code, isDay);
  const tempC = Math.round(current.temperature_2m);
  const feelsLikeC = Math.round(current.apparent_temperature);
  const windKmh = current.wind_speed_10m;
  const windMph = Math.round(windKmh * 0.621371);
  const windDeg = current.wind_direction_10m || 0;
  const windDirText = degToCardinal(windDeg);

  // Daily processing
  const daily: DailyForecastItem[] = [];
  const dailyCount = data.daily?.time?.length || 0;

  for (let i = 0; i < Math.min(dailyCount, 7); i++) {
    const dateStr = data.daily.time[i];
    const dateObj = new Date(dateStr + "T00:00:00");
    const dayName =
      i === 0
        ? "Today"
        : new Intl.DateTimeFormat("en", { weekday: "short" }).format(dateObj);

    const minC = Math.round(data.daily.temperature_2m_min[i]);
    const maxC = Math.round(data.daily.temperature_2m_max[i]);
    const dCode = data.daily.weather_code[i];
    const dCond = getWmoCondition(dCode, true);
    const rainChance = data.daily.precipitation_probability_max?.[i] ?? 0;
    const uv = data.daily.uv_index_max?.[i] ?? 3;

    const sunriseRaw = data.daily.sunrise?.[i] || "";
    const sunsetRaw = data.daily.sunset?.[i] || "";

    const sunriseFormatted = sunriseRaw
      ? new Date(sunriseRaw).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      : "6:00 AM";
    const sunsetFormatted = sunsetRaw
      ? new Date(sunsetRaw).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      : "6:30 PM";

    daily.push({
      date: dateStr,
      dayName,
      minTempC: minC,
      maxTempC: maxC,
      minTempF: cToF(minC),
      maxTempF: cToF(maxC),
      condition: dCond,
      rainChance,
      sunriseTime: sunriseFormatted,
      sunsetTime: sunsetFormatted,
      uvIndex: uv,
    });
  }

  // Hourly processing (next 24 hours starting from current hour)
  const hourly: HourlyForecastItem[] = [];
  if (data.hourly?.time) {
    const nowIsoHour = new Date().toISOString().slice(0, 13);
    let startIndex = data.hourly.time.findIndex((t: string) => t.startsWith(nowIsoHour));
    if (startIndex < 0) startIndex = 0;

    for (let i = startIndex; i < Math.min(startIndex + 24, data.hourly.time.length); i++) {
      const timeStr = data.hourly.time[i];
      const timeObj = new Date(timeStr);
      const isCurrentHour = i === startIndex;
      const hourText = isCurrentHour
        ? "Now"
        : new Intl.DateTimeFormat("en", { hour: "numeric" }).format(timeObj);

      const hTempC = Math.round(data.hourly.temperature_2m[i]);
      const hIsDay = data.hourly.is_day[i] === 1;
      const hCode = data.hourly.weather_code[i];
      const hCond = getWmoCondition(hCode, hIsDay);
      const hRain = data.hourly.precipitation_probability[i] ?? 0;

      hourly.push({
        time: timeStr,
        hourText,
        tempC: hTempC,
        tempF: cToF(hTempC),
        condition: hCond,
        rainChance: hRain,
        isDay: hIsDay,
      });
    }
  }

  const todayDaily = daily[0] || {
    sunriseTime: "06:15 AM",
    sunsetTime: "06:45 PM",
    uvIndex: 4,
    rainChance: 10,
  };

  const currentWeather: CurrentWeather = {
    cityName: locationName,
    country: country,
    latitude: lat,
    longitude: lon,
    tempC,
    feelsLikeC,
    tempF: cToF(tempC),
    feelsLikeF: cToF(feelsLikeC),
    humidity: current.relative_humidity_2m,
    pressure: Math.round(current.surface_pressure),
    windSpeedKmh: Math.round(windKmh),
    windSpeedMph: windMph,
    windDirectionDeg: windDeg,
    windDirectionText: windDirText,
    visibilityKm: 10, // estimated clear baseline
    visibilityMiles: 6.2,
    uvIndex: todayDaily.uvIndex,
    uvDescription: getUvCategory(todayDaily.uvIndex),
    rainChance: todayDaily.rainChance,
    condition,
    isDay,
    sunriseTime: todayDaily.sunriseTime,
    sunsetTime: todayDaily.sunsetTime,
    timezone: data.timezone || "auto",
    updatedAt: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
  };

  return {
    current: currentWeather,
    hourly,
    daily,
    source: "open-meteo",
  };
}

export async function fetchWeatherFromOpenWeather(
  city: string,
  apiKey: string
): Promise<FullWeatherData> {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) throw new Error(`Could not find "${city}". Try another location.`);
    if (response.status === 401) throw new Error("Invalid OpenWeather API Key.");
    throw new Error("OpenWeather service error.");
  }

  const data = await response.json();
  const lat = data.coord.lat;
  const lon = data.coord.lon;

  // Enhance with Open-Meteo for rich hourly & 7-day data seamlessly
  const openMeteoData = await fetchWeatherFromOpenMeteo(lat, lon, data.name, data.sys.country);

  const owCondition: WeatherCondition = {
    main: data.weather[0]?.main || "Clear",
    description: data.weather[0]?.description || "Clear Sky",
    iconName: (openMeteoData.current.condition.iconName || "sun") as any,
    bgImage: openMeteoData.current.condition.bgImage,
    accentColor: openMeteoData.current.condition.accentColor,
  };

  const tempC = Math.round(data.main.temp);
  const feelsLikeC = Math.round(data.main.feels_like);

  return {
    ...openMeteoData,
    current: {
      ...openMeteoData.current,
      cityName: data.name,
      country: data.sys.country,
      tempC,
      feelsLikeC,
      tempF: cToF(tempC),
      feelsLikeF: cToF(feelsLikeC),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      visibilityKm: Number(((data.visibility || 10000) / 1000).toFixed(1)),
      visibilityMiles: Number(((data.visibility || 10000) / 1609.34).toFixed(1)),
      condition: owCondition,
    },
    source: "open-weather",
  };
}

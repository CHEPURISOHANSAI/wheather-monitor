# Atmos — Modern Weather Forecasting & Atmospheric Radar

An elegant, high-precision weather application built with **React 19**, **Vite 8**, **Tailwind CSS v4**, and **Lucide Icons**.

## Features

- **Zero-Setup Meteorological Engine**: Runs out of the box with Open-Meteo High-Resolution Satellite & Radar feeds — **no API key required**.
- **Optional OpenWeather Integration**: Supports custom OpenWeatherMap API keys if preferred.
- **Dynamic Sky Ambiance**: Automatically adjusts photographic backdrops and atmospheric lighting to match live conditions (Clear Day/Night, Cloud Cover, Rain, Fog, Snow, Storms).
- **24-Hour Hourly Timeline**: Interactive scrollable hourly forecast detailing temperatures, weather icons, and precipitation probabilities.
- **7-Day Extended Outlook**: Visual weekly forecast with daily high/low temperature distribution bars and rain probability.
- **8 Atmospheric Metrics**:
  - Humidity with comfort commentary
  - Wind speed & direction (cardinal + degrees)
  - UV Index with risk tiers
  - Precipitation probability
  - Visibility (km / miles)
  - Atmospheric surface pressure (hPa)
  - Sunrise and sunset times
- **Units Toggle**: Seamlessly switch between Celsius (°C) and Fahrenheit (°F).
- **Geolocation Radar**: 1-click GPS detection to inspect your immediate local conditions.
- **City Search with Autocomplete**: Instant geocoding search for worldwide cities, states, and countries.
- **Saved Places & Trending Chips**: Bookmark favorite cities with persistence via `localStorage`.

## Getting Started

### 1. Start Development Server
Double-click `start-dev.bat` or run:
```bash
pnpm dev
# or: npm run dev
```

Open your browser at `http://localhost:5173` (or the port specified in terminal).

### 2. Build for Production
```bash
pnpm build
# or: npm run build
```
Outputs static files to `dist/`.

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Compass, Layers, Settings2, Sparkles } from "lucide-react";
import { FullWeatherData } from "./types/weather";
import {
  fetchWeatherFromOpenMeteo,
  fetchWeatherFromOpenWeather,
  reverseGeocode,
  searchCities,
} from "./services/weatherService";
import HeroBanner from "./components/HeroBanner";
import SearchBar from "./components/SearchBar";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import MetricCards from "./components/MetricCards";
import WeatherInsights from "./components/WeatherInsights";
import AirQualityCard from "./components/AirQualityCard";
import AstronomyCard from "./components/AstronomyCard";
import SavedCities from "./components/SavedCities";
import SettingsModal from "./components/SettingsModal";
import WeatherRadarModal from "./components/WeatherRadarModal";
import ShareWeatherModal from "./components/ShareWeatherModal";

export default function App() {
  const [weatherData, setWeatherData] = useState<FullWeatherData | null>(null);
  const [activeCity, setActiveCity] = useState("London");
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // User preferences persisted in localStorage
  const [unit, setUnit] = useState<"C" | "F">(() => {
    return (localStorage.getItem("atmos_temp_unit") as "C" | "F") || "C";
  });

  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    return localStorage.getItem("atmos_openweather_key") || "";
  });

  const [savedCities, setSavedCities] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("atmos_saved_cities");
      return stored ? JSON.parse(stored) : ["Tokyo", "New York", "Paris"];
    } catch {
      return ["Tokyo", "New York", "Paris"];
    }
  });

  // Save changes to localStorage
  const handleUnitChange = (newUnit: "C" | "F") => {
    setUnit(newUnit);
    localStorage.setItem("atmos_temp_unit", newUnit);
  };

  const handleToggleUnit = () => {
    handleUnitChange(unit === "C" ? "F" : "C");
  };

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    localStorage.setItem("atmos_openweather_key", key);
  };

  const handleToggleFavorite = () => {
    if (!weatherData) return;
    const name = weatherData.current.cityName;
    setSavedCities((prev) => {
      const exists = prev.some((c) => c.toLowerCase() === name.toLowerCase());
      const updated = exists
        ? prev.filter((c) => c.toLowerCase() !== name.toLowerCase())
        : [...prev, name];
      localStorage.setItem("atmos_saved_cities", JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveSaved = (cityToRemove: string) => {
    setSavedCities((prev) => {
      const updated = prev.filter((c) => c.toLowerCase() !== cityToRemove.toLowerCase());
      localStorage.setItem("atmos_saved_cities", JSON.stringify(updated));
      return updated;
    });
  };

  // Fetch weather by coordinates
  const loadWeatherByCoords = useCallback(
    async (lat: number, lon: number, cityName: string, country: string) => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const apiKey = customApiKey || (import.meta.env.VITE_OPENWEATHER_API_KEY as string | undefined);

        let data: FullWeatherData;
        if (apiKey) {
          try {
            data = await fetchWeatherFromOpenWeather(cityName, apiKey);
          } catch {
            // fallback to high resolution open-meteo if openweather fails
            data = await fetchWeatherFromOpenMeteo(lat, lon, cityName, country);
          }
        } else {
          data = await fetchWeatherFromOpenMeteo(lat, lon, cityName, country);
        }

        setWeatherData(data);
        setActiveCity(cityName);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Unable to retrieve meteorological data. Please retry."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [customApiKey]
  );

  // Fetch weather by search string
  const loadWeatherByQuery = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;

      setIsLoading(true);
      setErrorMessage("");

      try {
        const results = await searchCities(trimmed);
        if (!results || results.length === 0) {
          throw new Error(`We couldn't locate “${trimmed}”. Please check the spelling.`);
        }

        const top = results[0];
        await loadWeatherByCoords(top.latitude, top.longitude, top.name, top.country);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Error searching location.");
        setIsLoading(false);
      }
    },
    [loadWeatherByCoords]
  );

  // Geolocation handler
  const handleRequestGeolocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setErrorMessage("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const geo = await reverseGeocode(lat, lon);
          await loadWeatherByCoords(lat, lon, geo.name, geo.country);
        } catch {
          setErrorMessage("Failed to locate current position.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        setErrorMessage("Location permission was denied. You can search any city manually.");
      },
      { timeout: 8000 }
    );
  };

  // Refresh current city
  const handleRefresh = async () => {
    if (!weatherData) return;
    setIsRefreshing(true);
    await loadWeatherByCoords(
      weatherData.current.latitude,
      weatherData.current.longitude,
      weatherData.current.cityName,
      weatherData.current.country
    );
    setIsRefreshing(false);
  };

  // On mount: load initial city
  useEffect(() => {
    void loadWeatherByQuery("London");
  }, []);

  const isCurrentFavorite = Boolean(
    weatherData &&
      savedCities.some(
        (c) => c.toLowerCase() === weatherData.current.cityName.toLowerCase()
      )
  );

  return (
    <main className="min-h-screen bg-[#dfe7e2] p-3 text-[#18221d] sm:p-5 lg:flex lg:items-center lg:justify-center lg:p-8">
      <div className="relative mx-auto grid min-h-[calc(100vh-1.5rem)] w-full max-w-[1340px] overflow-hidden rounded-[1.75rem] bg-[#f6f7f2] shadow-[0_32px_100px_rgba(26,44,35,0.17)] sm:min-h-[calc(100vh-2.5rem)] sm:rounded-[2.25rem] lg:min-h-[min(880px,calc(100vh-4rem))] lg:grid-cols-[1.1fr_1.3fr]">
        {/* Left Section: Hero Visual Display */}
        <HeroBanner
          weather={weatherData ? weatherData.current : null}
          unit={unit}
          onToggleUnit={handleToggleUnit}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          isFavorite={isCurrentFavorite}
          onToggleFavorite={handleToggleFavorite}
          onOpenRadar={() => setIsRadarOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
        />

        {/* Right Section: Interactive Meteorological Hub */}
        <section className="flex flex-col p-6 sm:p-8 lg:p-10 max-h-[940px] overflow-y-auto">
          {/* Header & Controls */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#86928b]">
                Atmospheric Station
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#192721] sm:text-3xl">
                Explore a city
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {weatherData && (
                <button
                  type="button"
                  onClick={() => setIsRadarOpen(true)}
                  title="Open live precipitation radar"
                  className="flex size-11 items-center justify-center rounded-2xl border border-[#dbe1dd] bg-white text-[#38bdf8] shadow-sm transition hover:border-[#9ab1a4] hover:bg-[#f1f5f2] active:scale-95"
                >
                  <Layers className="size-5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                title="Open preferences & settings"
                className="flex size-11 items-center justify-center rounded-2xl border border-[#dbe1dd] bg-white text-[#52635a] shadow-sm transition hover:border-[#9ab1a4] hover:bg-[#f1f5f2] active:scale-95"
              >
                <Settings2 className="size-5" />
              </button>
            </div>
          </div>

          {/* Search Bar with autocomplete & GPS */}
          <SearchBar
            onSelectCity={(name, country, lat, lon) => {
              void loadWeatherByCoords(lat, lon, name, country);
            }}
            onSearchQuery={(q) => void loadWeatherByQuery(q)}
            onRequestGeolocation={handleRequestGeolocation}
            isLocating={isLocating}
            isLoading={isLoading}
          />

          {/* Error Notice */}
          {errorMessage && (
            <div
              aria-live="polite"
              className="mt-4 flex items-center gap-2.5 rounded-2xl border border-[#edccc1] bg-[#fff4f0] px-4 py-3 text-xs font-semibold leading-5 text-[#a14f39] animate-[fadeUp_200ms_ease-out]"
            >
              <AlertCircle className="size-4 shrink-0 text-[#a14f39]" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && !weatherData && (
            <div className="mt-8 space-y-4 animate-pulse">
              <div className="h-28 rounded-2xl bg-[#e5ece7]" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-24 rounded-2xl bg-[#e5ece7]" />
                ))}
              </div>
            </div>
          )}

          {/* Forecast details when loaded */}
          {weatherData && (
            <div className="animate-[fadeUp_300ms_ease-out]">
              {/* Smart Insights & Personalized Advisory */}
              {weatherData.insights && weatherData.insights.length > 0 && (
                <WeatherInsights insights={weatherData.insights} />
              )}

              {/* Hourly 24h timeline */}
              <HourlyForecast items={weatherData.hourly} unit={unit} />

              {/* 8 Vital atmospheric metrics */}
              <MetricCards weather={weatherData.current} unit={unit} />

              {/* Air Quality Index Breakdown */}
              <AirQualityCard airQuality={weatherData.airQuality} />

              {/* Astronomy & Solar Arc */}
              <AstronomyCard astronomy={weatherData.astronomy} />

              {/* 7-day extended outlook */}
              <DailyForecast items={weatherData.daily} unit={unit} />

              {/* Saved & Trending Cities */}
              <SavedCities
                savedCities={savedCities}
                activeCity={activeCity}
                onSelectCity={(city) => void loadWeatherByQuery(city)}
                onRemoveSaved={handleRemoveSaved}
              />
            </div>
          )}

          {/* Footer Metadata */}
          <div className="mt-10 flex items-center justify-between border-t border-[#e0e5e2] pt-4 text-[11px] font-bold uppercase tracking-[0.13em] text-[#97a09b]">
            <span>
              {weatherData?.source === "open-weather"
                ? "OpenWeatherMap Active"
                : "Open-Meteo Satellite Feed"}
            </span>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="transition hover:text-[#284236] underline underline-offset-2"
            >
              Units: °{unit} · Settings
            </button>
          </div>
        </section>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        unit={unit}
        onChangeUnit={handleUnitChange}
        customApiKey={customApiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      {/* Live Precipitation Radar Map Modal */}
      {weatherData && (
        <WeatherRadarModal
          isOpen={isRadarOpen}
          onClose={() => setIsRadarOpen(false)}
          lat={weatherData.current.latitude}
          lon={weatherData.current.longitude}
          cityName={weatherData.current.cityName}
        />
      )}

      {/* Share Weather Summary Modal */}
      {weatherData && (
        <ShareWeatherModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          weather={weatherData.current}
          unit={unit}
        />
      )}
    </main>
  );
}

import {
  Map,
  MapPin,
  RefreshCw,
  Share2,
  Star,
  Thermometer,
} from "lucide-react";
import { CurrentWeather } from "../types/weather";
import WeatherIcon from "./WeatherIcon";
import AmbientSoundPlayer from "./AmbientSoundPlayer";

type HeroBannerProps = {
  weather: CurrentWeather | null;
  unit: "C" | "F";
  onToggleUnit: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenRadar: () => void;
  onOpenShare: () => void;
};

export default function HeroBanner({
  weather,
  unit,
  onToggleUnit,
  onRefresh,
  isRefreshing,
  isFavorite,
  onToggleFavorite,
  onOpenRadar,
  onOpenShare,
}: HeroBannerProps) {
  const currentDate = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const currentTemp = weather ? (unit === "C" ? weather.tempC : weather.tempF) : null;
  const currentFeelsLike = weather ? (unit === "C" ? weather.feelsLikeC : weather.feelsLikeF) : null;

  const bgImage =
    weather?.condition.bgImage ||
    "https://images.unsplash.com/photo-1522011916481-b7f27c0bf69b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=85&w=1600";

  return (
    <section className="relative min-h-[500px] overflow-hidden p-6 text-white sm:min-h-[580px] sm:p-10 lg:min-h-full lg:p-12">
      {/* Background Image with smooth crossfade */}
      <img
        alt="Weather sky scenery"
        className="absolute inset-0 size-full object-cover transition-opacity duration-700"
        src={bgImage}
      />

      {/* Atmospheric Multi-layer Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1c1f]/40 via-[#0a191a]/15 to-[#091919]/85" />
      <div className="absolute inset-0 bg-[#1c4c50]/15 mix-blend-multiply" />

      {/* Content wrapper */}
      <div className="relative flex h-full min-h-[440px] flex-col justify-between sm:min-h-[500px] lg:min-h-full">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-10 items-center justify-center rounded-full border border-white/35 bg-white/15 backdrop-blur-md shadow-inner">
              <span className="size-3 rounded-full bg-[#e9ff74] shadow-[0_0_18px_rgba(233,255,116,0.9)] animate-pulse" />
            </span>
            <span className="text-base font-bold tracking-tight">Atmos</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Ambient soundscape toggle */}
            <AmbientSoundPlayer weatherMain={weather?.condition.main} />

            {/* Units button */}
            <button
              onClick={onToggleUnit}
              title={`Switch to °${unit === "C" ? "F" : "C"}`}
              className="group flex items-center gap-1.5 rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition hover:bg-white/20 active:scale-95"
            >
              <Thermometer className="size-3.5 text-[#e9ff74]" />
              <span>°{unit}</span>
            </button>

            {/* Weather actions (Radar, Share, Refresh) */}
            {weather && (
              <>
                <button
                  type="button"
                  onClick={onOpenRadar}
                  title="Open live precipitation radar map"
                  className="flex items-center gap-1.5 rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition hover:bg-white/20 active:scale-95"
                >
                  <Map className="size-3.5 text-[#38bdf8]" />
                  <span className="hidden sm:inline">Radar</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenShare}
                  title="Share weather forecast"
                  className="flex size-8 items-center justify-center rounded-full border border-white/25 bg-black/20 backdrop-blur-md transition hover:bg-white/20 active:scale-95"
                >
                  <Share2 className="size-3.5 text-white" />
                </button>

                <button
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  title="Refresh live data"
                  className="flex size-8 items-center justify-center rounded-full border border-white/25 bg-black/20 backdrop-blur-md transition hover:bg-white/20 active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`size-3.5 ${
                      isRefreshing ? "animate-spin text-[#e9ff74]" : "text-white"
                    }`}
                  />
                </button>
              </>
            )}

            <p className="hidden rounded-full border border-white/25 bg-black/20 px-4 py-1.5 text-xs font-medium backdrop-blur-md xl:block">
              {currentDate}
            </p>
          </div>
        </div>

        {/* Center Main Forecast Display */}
        {weather ? (
          <div className="max-w-xl animate-[fadeUp_500ms_ease-out]">
            {/* Location & Favorite toggle */}
            <div className="mb-4 flex items-center gap-2 text-white/85">
              <MapPin className="size-4.5 text-[#e9ff74]" />
              <span className="text-sm font-semibold tracking-wide sm:text-base">
                {weather.cityName}
                {weather.country ? `, ${weather.country}` : ""}
              </span>
              <button
                onClick={onToggleFavorite}
                title={isFavorite ? "Remove from saved cities" : "Save this city"}
                className="ml-1.5 rounded-full p-1 text-white/70 transition hover:bg-white/20 hover:text-white"
              >
                <Star
                  className={`size-4 ${
                    isFavorite ? "fill-[#e9ff74] text-[#e9ff74]" : "hover:text-[#e9ff74]"
                  }`}
                />
              </button>
            </div>

            {/* Giant Temperature & Icon */}
            <div className="flex items-end gap-5">
              <p className="text-[7.5rem] font-medium leading-[0.72] tracking-[-0.095em] sm:text-[9.5rem] drop-shadow-md">
                {currentTemp}
                <span className="ml-1 align-top text-4xl font-light tracking-normal sm:text-5xl">°</span>
              </p>
              <div className="mb-2 drop-shadow-[0_16px_20px_rgba(0,0,0,0.35)]">
                <WeatherIcon
                  condition={weather.condition}
                  className="size-20 sm:size-24"
                  isDay={weather.isDay}
                />
              </div>
            </div>

            {/* Condition summary footer */}
            <div className="mt-8 flex items-end justify-between gap-5 border-t border-white/25 pt-5">
              <div>
                <p className="font-display text-3xl capitalize tracking-[-0.02em] sm:text-4xl text-white drop-shadow-sm">
                  {weather.condition.description}
                </p>
                <p className="mt-1.5 text-sm text-white/75 font-medium">
                  Feels like {currentFeelsLike}° ·{" "}
                  {weather.rainChance > 0
                    ? `${weather.rainChance}% precipitation`
                    : "Optimal conditions"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1.5 rounded-full bg-[#e9ff74] px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#1a2b25] sm:flex shadow-sm">
                  <span className="size-1.5 rounded-full bg-[#1a2b25] animate-ping" />
                  Live now
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-lg">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#e9ff74]">
              Your local forecast
            </p>
            <h1 className="font-display text-5xl leading-[0.96] tracking-[-0.035em] sm:text-7xl">
              Weather that feels clear.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
              A calm, simple view of what is happening outside—wherever you are in the world.
            </p>
          </div>
        )}

        {/* Bottom footer credit & timezone */}
        <div className="flex items-center justify-between text-[11px] text-white/50">
          <span>{weather ? `Updated ${weather.updatedAt}` : "Global Meteorological Radar"}</span>
          <span className="text-white/40">Atmos v2.5</span>
        </div>
      </div>
    </section>
  );
}

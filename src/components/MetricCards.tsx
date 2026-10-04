import {
  Compass,
  Droplets,
  Eye,
  Gauge,
  Sun,
  Sunrise,
  Sunset,
  Umbrella,
  Wind,
} from "lucide-react";
import { CurrentWeather } from "../types/weather";

type MetricCardsProps = {
  weather: CurrentWeather;
  unit: "C" | "F";
};

export default function MetricCards({ weather, unit }: MetricCardsProps) {
  const windSpeed = unit === "C" ? `${weather.windSpeedKmh} km/h` : `${weather.windSpeedMph} mph`;
  const visibility = unit === "C" ? `${weather.visibilityKm} km` : `${weather.visibilityMiles} mi`;

  const getHumidityNote = (h: number) => {
    if (h < 35) return "Dry & crisp air";
    if (h <= 65) return "Comfortable level";
    return "High moisture";
  };

  const metrics = [
    {
      icon: <Droplets className="size-4.5 text-[#0284c7]" />,
      label: "Humidity",
      value: `${weather.humidity}%`,
      subtext: getHumidityNote(weather.humidity),
    },
    {
      icon: <Wind className="size-4.5 text-[#0d9488]" />,
      label: "Wind Speed",
      value: windSpeed,
      subtext: `Direction: ${weather.windDirectionText} (${weather.windDirectionDeg}°)`,
    },
    {
      icon: <Sun className="size-4.5 text-[#eab308]" />,
      label: "UV Index",
      value: `${weather.uvIndex} / 11`,
      subtext: `${weather.uvDescription} risk`,
    },
    {
      icon: <Umbrella className="size-4.5 text-[#6366f1]" />,
      label: "Precipitation",
      value: `${weather.rainChance}%`,
      subtext: weather.rainChance > 40 ? "Rain expected" : "Low precipitation",
    },
    {
      icon: <Eye className="size-4.5 text-[#10b981]" />,
      label: "Visibility",
      value: visibility,
      subtext: weather.visibilityKm >= 9 ? "Clear view" : "Reduced visibility",
    },
    {
      icon: <Gauge className="size-4.5 text-[#8b5cf6]" />,
      label: "Air Pressure",
      value: `${weather.pressure} hPa`,
      subtext: weather.pressure > 1013 ? "High pressure" : "Normal pressure",
    },
    {
      icon: <Sunrise className="size-4.5 text-[#f97316]" />,
      label: "Sunrise",
      value: weather.sunriseTime,
      subtext: "Dawn breakdown",
    },
    {
      icon: <Sunset className="size-4.5 text-[#ec4899]" />,
      label: "Sunset",
      value: weather.sunsetTime,
      subtext: "Dusk horizon",
    },
  ];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between border-b border-[#dfe5e1] pb-3">
        <div className="flex items-center gap-2">
          <Compass className="size-4 text-[#687b71]" />
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#74827a]">
            Atmospheric Conditions
          </p>
        </div>
        <span className="text-xs font-semibold text-[#8a9890]">Real-Time Metrics</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="group rounded-2xl border border-[#dfe5e1] bg-white/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#cad4ce] hover:bg-white"
          >
            <div className="flex items-center gap-2 text-[#74827a]">
              {m.icon}
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#697a71]">
                {m.label}
              </span>
            </div>
            <p className="mt-3 text-lg font-bold tracking-tight text-[#18221d] sm:text-xl">
              {m.value}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#8c9c93]">
              {m.subtext}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

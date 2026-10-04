import { Clock, Droplets } from "lucide-react";
import { HourlyForecastItem } from "../types/weather";
import WeatherIcon from "./WeatherIcon";

type HourlyForecastProps = {
  items: HourlyForecastItem[];
  unit: "C" | "F";
};

export default function HourlyForecast({ items, unit }: HourlyForecastProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between border-b border-[#dfe5e1] pb-3">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-[#687b71]" />
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#74827a]">
            Hourly Forecast
          </p>
        </div>
        <span className="text-xs font-semibold text-[#8a9890]">Next 24 Hours</span>
      </div>

      <div className="mt-4 flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none [scrollbar-width:none]">
        {items.map((item, idx) => {
          const temp = unit === "C" ? item.tempC : item.tempF;
          const isNow = idx === 0;

          return (
            <div
              key={item.time}
              className={`flex min-w-[78px] flex-col items-center rounded-2xl border p-3 text-center transition hover:-translate-y-0.5 ${
                isNow
                  ? "border-[#29443a] bg-[#1a2e26] text-white shadow-md"
                  : "border-[#dfe5e1] bg-white/70 hover:border-[#cad4ce] hover:bg-white text-[#18221d]"
              }`}
            >
              <span className={`text-[11px] font-bold ${isNow ? "text-[#e9ff74]" : "text-[#77867e]"}`}>
                {item.hourText}
              </span>

              <div className="my-2.5">
                <WeatherIcon
                  condition={item.condition}
                  className="size-6"
                  isDay={item.isDay}
                />
              </div>

              <span className="text-base font-bold tracking-tight">
                {temp}°
              </span>

              {item.rainChance > 0 ? (
                <div className="mt-1.5 flex items-center gap-0.5 text-[10px] font-extrabold text-[#38bdf8]">
                  <Droplets className="size-2.5" />
                  <span>{item.rainChance}%</span>
                </div>
              ) : (
                <div className="mt-1.5 h-3.5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { Calendar, Droplets } from "lucide-react";
import { DailyForecastItem } from "../types/weather";
import WeatherIcon from "./WeatherIcon";

type DailyForecastProps = {
  items: DailyForecastItem[];
  unit: "C" | "F";
};

export default function DailyForecast({ items, unit }: DailyForecastProps) {
  if (!items || items.length === 0) return null;

  // Calculate lowest and highest across 7 days for relative temp bar scaling
  const allMins = items.map((i) => (unit === "C" ? i.minTempC : i.minTempF));
  const allMaxs = items.map((i) => (unit === "C" ? i.maxTempC : i.maxTempF));
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const tempRange = Math.max(1, globalMax - globalMin);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between border-b border-[#dfe5e1] pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-[#687b71]" />
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#74827a]">
            7-Day Outlook
          </p>
        </div>
        <span className="text-xs font-semibold text-[#8a9890]">Weekly Trends</span>
      </div>

      <div className="mt-4 flex flex-col divide-y divide-[#e9eee9]">
        {items.map((day, idx) => {
          const min = unit === "C" ? day.minTempC : day.minTempF;
          const max = unit === "C" ? day.maxTempC : day.maxTempF;

          const leftPercent = Math.max(0, ((min - globalMin) / tempRange) * 100);
          const rightPercent = Math.max(0, ((globalMax - max) / tempRange) * 100);

          return (
            <div
              key={day.date}
              className="flex items-center justify-between py-3 transition hover:bg-white/50 px-2 rounded-xl"
            >
              {/* Day name */}
              <div className="w-20">
                <p className={`text-sm font-bold ${idx === 0 ? "text-[#1b3429]" : "text-[#2e3e35]"}`}>
                  {day.dayName}
                </p>
              </div>

              {/* Weather icon & condition */}
              <div className="flex flex-1 items-center gap-2.5">
                <WeatherIcon condition={day.condition} className="size-5 shrink-0" />
                <span className="hidden text-xs font-medium text-[#5c6c64] sm:inline truncate max-w-[120px]">
                  {day.condition.main}
                </span>

                {day.rainChance > 20 && (
                  <span className="flex items-center gap-0.5 rounded-full bg-[#e0f2fe] px-2 py-0.5 text-[10px] font-bold text-[#0284c7]">
                    <Droplets className="size-2.5" />
                    {day.rainChance}%
                  </span>
                )}
              </div>

              {/* Min - Max Temperature Bar */}
              <div className="flex items-center gap-3">
                <span className="w-8 text-right text-xs font-semibold text-[#809088]">
                  {min}°
                </span>

                <div className="relative h-2 w-20 sm:w-28 rounded-full bg-[#e5ece7] overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-[#60a5fa] via-[#34d399] to-[#f59e0b]"
                    style={{
                      left: `${leftPercent}%`,
                      right: `${rightPercent}%`,
                    }}
                  />
                </div>

                <span className="w-8 text-left text-xs font-bold text-[#18221d]">
                  {max}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

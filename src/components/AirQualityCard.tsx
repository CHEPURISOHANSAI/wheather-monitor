import { Activity, Wind } from "lucide-react";
import { AirQualityData } from "../types/weather";

type AirQualityCardProps = {
  airQuality?: AirQualityData;
};

export default function AirQualityCard({ airQuality }: AirQualityCardProps) {
  if (!airQuality) return null;

  // Scale percent (0 to 300)
  const percent = Math.min(100, Math.round((airQuality.aqi / 300) * 100));

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between border-b border-[#dfe5e1] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-[#687b71]" />
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#74827a]">
            Air Quality Index (AQI)
          </p>
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white shadow-xs"
          style={{ backgroundColor: airQuality.color }}
        >
          {airQuality.category}
        </span>
      </div>

      <div className="mt-4 rounded-2xl border border-[#dfe5e1] bg-white/70 p-5 transition hover:border-[#cad4ce] hover:bg-white">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#6e7f76]">US AQI Standard</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-[#18221d]">
                {airQuality.aqi}
              </span>
              <span className="text-xs font-bold text-[#8a9891]">/ 500 scale</span>
            </div>
          </div>
          <p className="max-w-md text-xs leading-5 text-[#52645a]">
            {airQuality.advice}
          </p>
        </div>

        {/* Visual Gradient Meter Bar */}
        <div className="mt-4">
          <div className="relative h-2.5 w-full rounded-full bg-gradient-to-r from-[#10b981] via-[#f59e0b] via-[#ef4444] to-[#a855f7] overflow-hidden">
            <div
              className="absolute top-0 bottom-0 w-1.5 bg-white border border-black/40 rounded-full shadow-md"
              style={{ left: `calc(${percent}% - 3px)` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] font-bold text-[#8d9c93]">
            <span>0 Good</span>
            <span>50 Moderate</span>
            <span>150 Unhealthy</span>
            <span>300+ Hazardous</span>
          </div>
        </div>

        {/* Detailed Pollutants Grid */}
        <div className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-6 border-t border-[#edf2ee] pt-4">
          <div className="rounded-xl bg-[#f5f8f6] p-2.5 text-center">
            <p className="text-[10px] font-bold text-[#72837a]">PM2.5</p>
            <p className="mt-1 text-sm font-bold text-[#18221d]">{airQuality.pm25} <span className="text-[9px] font-normal text-[#8c9c93]">µg/m³</span></p>
          </div>
          <div className="rounded-xl bg-[#f5f8f6] p-2.5 text-center">
            <p className="text-[10px] font-bold text-[#72837a]">PM10</p>
            <p className="mt-1 text-sm font-bold text-[#18221d]">{airQuality.pm10} <span className="text-[9px] font-normal text-[#8c9c93]">µg/m³</span></p>
          </div>
          <div className="rounded-xl bg-[#f5f8f6] p-2.5 text-center">
            <p className="text-[10px] font-bold text-[#72837a]">Ozone (O₃)</p>
            <p className="mt-1 text-sm font-bold text-[#18221d]">{airQuality.o3} <span className="text-[9px] font-normal text-[#8c9c93]">µg/m³</span></p>
          </div>
          <div className="rounded-xl bg-[#f5f8f6] p-2.5 text-center">
            <p className="text-[10px] font-bold text-[#72837a]">NO₂</p>
            <p className="mt-1 text-sm font-bold text-[#18221d]">{airQuality.no2} <span className="text-[9px] font-normal text-[#8c9c93]">µg/m³</span></p>
          </div>
          <div className="rounded-xl bg-[#f5f8f6] p-2.5 text-center">
            <p className="text-[10px] font-bold text-[#72837a]">SO₂</p>
            <p className="mt-1 text-sm font-bold text-[#18221d]">{airQuality.so2} <span className="text-[9px] font-normal text-[#8c9c93]">µg/m³</span></p>
          </div>
          <div className="rounded-xl bg-[#f5f8f6] p-2.5 text-center">
            <p className="text-[10px] font-bold text-[#72837a]">CO</p>
            <p className="mt-1 text-sm font-bold text-[#18221d]">{airQuality.co} <span className="text-[9px] font-normal text-[#8c9c93]">µg/m³</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

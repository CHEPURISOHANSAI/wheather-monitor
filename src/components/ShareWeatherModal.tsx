import { Check, Copy, Share2, X } from "lucide-react";
import { useState } from "react";
import { CurrentWeather } from "../types/weather";

type ShareWeatherModalProps = {
  isOpen: boolean;
  onClose: () => void;
  weather: CurrentWeather;
  unit: "C" | "F";
};

export default function ShareWeatherModal({
  isOpen,
  onClose,
  weather,
  unit,
}: ShareWeatherModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const temp = unit === "C" ? `${weather.tempC}°C` : `${weather.tempF}°F`;
  const feelsLike = unit === "C" ? `${weather.feelsLikeC}°C` : `${weather.feelsLikeF}°F`;
  const wind = unit === "C" ? `${weather.windSpeedKmh} km/h` : `${weather.windSpeedMph} mph`;

  const shareText = `🌦️ Atmos Weather Forecast
📍 ${weather.cityName}${weather.country ? `, ${weather.country}` : ""}
🌡️ ${temp} (${weather.condition.description}, feels like ${feelsLike})
💧 Humidity: ${weather.humidity}% · 💨 Wind: ${wind} (${weather.windDirectionText})
☀️ UV Index: ${weather.uvIndex} (${weather.uvDescription}) · 🌧️ Rain Chance: ${weather.rainChance}%
🌅 Sunrise: ${weather.sunriseTime} · 🌇 Sunset: ${weather.sunsetTime}
Live satellite report generated with Atmos.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Weather in ${weather.cityName} — Atmos`,
          text: shareText,
        });
      } catch {
        // cancelled
      }
    } else {
      void handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]">
      <div className="w-full max-w-md rounded-3xl border border-[#dfe5e1] bg-[#fbfcf9] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e5ebe7] pb-4">
          <div className="flex items-center gap-2 text-[#1f3128]">
            <Share2 className="size-5 text-[#345244]" />
            <h3 className="text-base font-bold">Share Weather Report</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[#73837b] transition hover:bg-[#ebf0ec] hover:text-[#18221d]"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5">
          <div className="rounded-2xl border border-[#dce3de] bg-white p-4 font-mono text-xs leading-6 text-[#2d3f35] whitespace-pre-wrap select-all shadow-inner">
            {shareText}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5 border-t border-[#e5ebe7] pt-4">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-[#d6ded8] bg-white px-4 py-2.5 text-xs font-bold text-[#2d4237] transition hover:bg-[#f1f5f2]"
          >
            {copied ? (
              <>
                <Check className="size-4 text-[#16a34a]" />
                <span className="text-[#16a34a]">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="size-4" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="flex items-center gap-1.5 rounded-xl bg-[#1e342a] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#2c473a]"
            >
              <Share2 className="size-4" />
              <span>Share</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

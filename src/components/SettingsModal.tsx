import { Key, Settings2, Sliders, X } from "lucide-react";
import { useState } from "react";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  unit: "C" | "F";
  onChangeUnit: (unit: "C" | "F") => void;
  customApiKey: string;
  onSaveApiKey: (key: string) => void;
};

export default function SettingsModal({
  isOpen,
  onClose,
  unit,
  onChangeUnit,
  customApiKey,
  onSaveApiKey,
}: SettingsModalProps) {
  const [apiKeyInput, setApiKeyInput] = useState(customApiKey);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]">
      <div className="w-full max-w-md rounded-3xl border border-[#dfe5e1] bg-[#fbfcf9] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e5ebe7] pb-4">
          <div className="flex items-center gap-2 text-[#1f3128]">
            <Settings2 className="size-5 text-[#345244]" />
            <h3 className="text-base font-bold">Preferences & Data Provider</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[#73837b] transition hover:bg-[#ebf0ec] hover:text-[#18221d]"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6">
          {/* Temperature unit */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#6c7d74]">
              Temperature Units
            </label>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeUnit("C")}
                className={`flex items-center justify-center rounded-2xl border py-2.5 text-sm font-bold transition ${
                  unit === "C"
                    ? "border-[#1e342a] bg-[#1e342a] text-[#e9ff74]"
                    : "border-[#d8ded9] bg-white text-[#45584f] hover:bg-[#f2f6f3]"
                }`}
              >
                Celsius (°C)
              </button>
              <button
                type="button"
                onClick={() => onChangeUnit("F")}
                className={`flex items-center justify-center rounded-2xl border py-2.5 text-sm font-bold transition ${
                  unit === "F"
                    ? "border-[#1e342a] bg-[#1e342a] text-[#e9ff74]"
                    : "border-[#d8ded9] bg-white text-[#45584f] hover:bg-[#f2f6f3]"
                }`}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          {/* Optional API Key */}
          <div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6c7d74]">
                <Key className="size-3.5 text-[#3b594b]" />
                <span>OpenWeatherMap Key (Optional)</span>
              </label>
            </div>
            <p className="mt-1 text-xs text-[#809088]">
              By default, Atmos uses free Open-Meteo with no API key needed. Add an OpenWeather key only if you prefer their telemetry.
            </p>
            <input
              type="text"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste custom OpenWeather API key here..."
              className="mt-2.5 h-11 w-full rounded-xl border border-[#d6ded8] bg-white px-3.5 text-xs font-mono text-[#18221d] outline-none transition focus:border-[#4d665a]"
            />
          </div>

          <div className="rounded-2xl border border-[#dfe7e2] bg-[#f0f4f1] p-3.5 text-xs text-[#52645b]">
            <p className="font-semibold text-[#273a31]">Zero Configuration Required</p>
            <p className="mt-0.5 text-[11px] text-[#6d7e75]">
              Real-time atmospheric modeling, 24h hourly projections, and 7-day forecasts work automatically with global satellite data.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-[#e5ebe7] pt-4">
          <button
            type="button"
            onClick={() => {
              onSaveApiKey(apiKeyInput.trim());
              onClose();
            }}
            className="rounded-xl bg-[#1e342a] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#2c473a]"
          >
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
}

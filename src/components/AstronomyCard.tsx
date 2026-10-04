import { Moon, Sun, Sunrise, Sunset } from "lucide-react";
import { AstronomyData } from "../types/weather";

type AstronomyCardProps = {
  astronomy?: AstronomyData;
};

export default function AstronomyCard({ astronomy }: AstronomyCardProps) {
  if (!astronomy) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between border-b border-[#dfe5e1] pb-3">
        <div className="flex items-center gap-2">
          <Sun className="size-4 text-[#eab308]" />
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#74827a]">
            Astronomy & Solar Path
          </p>
        </div>
        <span className="text-xs font-semibold text-[#8a9890]">Celestial Motion</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Solar Path Arc Card */}
        <div className="rounded-2xl border border-[#dfe5e1] bg-white/70 p-5 transition hover:border-[#cad4ce] hover:bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64766d]">Daylight Duration</span>
              <span className="rounded-full bg-[#fef9c3] px-2.5 py-0.5 text-xs font-bold text-[#854d0e]">
                {astronomy.dayLengthText}
              </span>
            </div>

            {/* Visual Solar Arc */}
            <div className="relative mt-5 h-20 w-full overflow-hidden">
              <svg className="size-full overflow-visible" viewBox="0 0 200 80">
                {/* Arc path */}
                <path
                  d="M 10 75 Q 100 -10 190 75"
                  fill="none"
                  stroke="#e2e8e4"
                  strokeDasharray="4 4"
                  strokeWidth="2.5"
                />
                {/* Sun position along quadratic curve */}
                {(() => {
                  const t = astronomy.sunProgressPercent / 100;
                  const x = (1 - t) * (1 - t) * 10 + 2 * (1 - t) * t * 100 + t * t * 190;
                  const y = (1 - t) * (1 - t) * 75 + 2 * (1 - t) * t * -10 + t * t * 75;
                  return (
                    <g transform={`translate(${x}, ${y})`}>
                      <circle r="7" fill="#facc15" className="shadow-lg" />
                      <circle r="12" fill="#facc15" opacity="0.3" className="animate-ping" />
                    </g>
                  );
                })()}
              </svg>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#edf2ee] pt-3 text-xs">
            <div className="flex items-center gap-1.5 text-[#52645a]">
              <Sunrise className="size-4 text-[#f97316]" />
              <div>
                <p className="text-[10px] text-[#84958c]">Sunrise</p>
                <p className="font-bold text-[#18221d]">{astronomy.sunriseTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[#52645a]">
              <Sunset className="size-4 text-[#ec4899]" />
              <div className="text-right">
                <p className="text-[10px] text-[#84958c]">Sunset</p>
                <p className="font-bold text-[#18221d]">{astronomy.sunsetTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lunar Moon Phase Card */}
        <div className="rounded-2xl border border-[#dfe5e1] bg-white/70 p-5 transition hover:border-[#cad4ce] hover:bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64766d]">Lunar Cycle</span>
              <span className="rounded-full bg-[#f1f5f9] px-2.5 py-0.5 text-xs font-bold text-[#475569]">
                {astronomy.moonIlluminationPercent}% Illumination
              </span>
            </div>

            <div className="my-6 flex items-center justify-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-[#0f172a] text-white shadow-md">
                <Moon className="size-8 text-[#93c5fd]" />
              </div>
              <div>
                <p className="text-lg font-bold text-[#18221d]">{astronomy.moonPhaseName}</p>
                <p className="text-xs text-[#73837b]">Synodic lunar month</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#edf2ee] pt-3 text-xs text-[#6e7f77]">
            <span>Next full moon cycle tracking active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

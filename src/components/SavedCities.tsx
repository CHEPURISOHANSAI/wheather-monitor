import { Bookmark, Star, X } from "lucide-react";

type SavedCitiesProps = {
  savedCities: string[];
  activeCity: string;
  onSelectCity: (city: string) => void;
  onRemoveSaved: (city: string) => void;
};

const TRENDING_CITIES = [
  "London",
  "Tokyo",
  "New York",
  "Paris",
  "Dubai",
  "Sydney",
  "Singapore",
  "Mumbai",
];

export default function SavedCities({
  savedCities,
  activeCity,
  onSelectCity,
  onRemoveSaved,
}: SavedCitiesProps) {
  return (
    <div className="mt-6 flex flex-col gap-3">
      {/* Saved Favorites if any */}
      {savedCities.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#798a81]">
            <Star className="size-3 text-[#eab308] fill-[#eab308]" />
            <span>Saved Places</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {savedCities.map((city) => {
              const isActive = city.toLowerCase() === activeCity.toLowerCase();
              return (
                <div
                  key={city}
                  className={`group flex items-center rounded-full border text-xs font-semibold transition ${
                    isActive
                      ? "border-[#29443a] bg-[#1a2d25] text-[#e9ff74]"
                      : "border-[#d8deda] bg-white text-[#45584f] hover:border-[#9db2a6] hover:bg-[#f2f6f3]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectCity(city)}
                    className="px-3 py-1.5"
                  >
                    {city}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSaved(city);
                    }}
                    title={`Remove ${city}`}
                    className="pr-2 pl-0.5 text-[#889890] transition hover:text-[#dc2626]"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trending / Quick Suggestions */}
      <div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#829289]">
          <Bookmark className="size-3 text-[#829289]" />
          <span>Quick Destinations</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {TRENDING_CITIES.map((city) => {
            const isActive = city.toLowerCase() === activeCity.toLowerCase();
            return (
              <button
                key={city}
                type="button"
                onClick={() => onSelectCity(city)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition active:scale-95 ${
                  isActive
                    ? "border-[#29443a] bg-[#1a2d25] text-[#e9ff74]"
                    : "border-[#dce2de] bg-white/80 text-[#52635a] hover:border-[#96aba0] hover:bg-[#f0f4f1]"
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

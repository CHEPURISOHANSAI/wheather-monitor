import { FormEvent, useEffect, useRef, useState } from "react";
import { Compass, Loader2, MapPin, Search, X } from "lucide-react";
import { GeoLocationResult } from "../types/weather";
import { searchCities } from "../services/weatherService";

type SearchBarProps = {
  onSelectCity: (name: string, country: string, lat: number, lon: number) => void;
  onSearchQuery: (query: string) => void;
  onRequestGeolocation: () => void;
  isLocating: boolean;
  isLoading: boolean;
};

export default function SearchBar({
  onSelectCity,
  onSearchQuery,
  onRequestGeolocation,
  isLocating,
  isLoading,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoLocationResult[]>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced auto-search for suggestions
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingSuggestions(true);
        const results = await searchCities(query);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setShowDropdown(false);
    onSearchQuery(query);
  }

  function handleSelect(item: GeoLocationResult) {
    setQuery(`${item.name}${item.country ? `, ${item.country}` : ""}`);
    setShowDropdown(false);
    onSelectCity(item.name, item.country, item.latitude, item.longitude);
  }

  return (
    <div className="relative mt-6" ref={containerRef}>
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <label className="sr-only" htmlFor="weather-city-input">
            Search by city
          </label>
          <Search className="pointer-events-none absolute left-4.5 top-1/2 size-5 -translate-y-1/2 text-[#7b8981]" />

          <input
            id="weather-city-input"
            type="text"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            placeholder="Search city, capital, or region..."
            className="h-14 w-full rounded-2xl border border-[#dce3de] bg-white pl-12 pr-10 text-sm font-semibold outline-none transition placeholder:font-medium placeholder:text-[#9ca7a1] focus:border-[#5c7468] focus:ring-4 focus:ring-[#5c7468]/10 sm:text-base"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                setShowDropdown(false);
              }}
              title="Clear input"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#8b9991] transition hover:bg-[#ebf0ec] hover:text-[#25372f]"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* GPS Current Location button */}
        <button
          type="button"
          onClick={onRequestGeolocation}
          disabled={isLocating}
          title="Use my current location"
          className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#dce3de] bg-white text-[#4a5e54] transition hover:border-[#8da096] hover:bg-[#f1f5f2] active:scale-95 disabled:cursor-wait disabled:opacity-60"
        >
          {isLocating ? (
            <Loader2 className="size-5 animate-spin text-[#29443a]" />
          ) : (
            <Compass className="size-5" />
          )}
        </button>

        {/* Search Submit button */}
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="h-14 shrink-0 rounded-2xl bg-[#172b24] px-6 text-xs font-bold text-white transition hover:bg-[#29443a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172b24] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span>Finding</span>
            </span>
          ) : (
            "Search"
          )}
        </button>
      </form>

      {/* Auto-suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-[#dce3de] bg-white p-2 shadow-xl animate-[fadeUp_200ms_ease-out]">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8a968f]">
            Matching Locations
          </div>
          {suggestions.map((item, idx) => (
            <button
              key={`${item.name}-${item.latitude}-${item.longitude}-${idx}`}
              type="button"
              onClick={() => handleSelect(item)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#25372f] transition hover:bg-[#f3f7f4]"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="size-4 text-[#607d71]" />
                <span className="font-semibold">{item.name}</span>
                {item.admin1 && (
                  <span className="text-xs text-[#74827a]">{item.admin1}</span>
                )}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8b9991]">
                {item.countryCode || item.country}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

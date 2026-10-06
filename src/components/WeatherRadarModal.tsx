import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import {
  Cloud,
  CloudLightning,
  CloudRain,
  Compass,
  Layers,
  Map as MapIcon,
  Maximize2,
  Minimize2,
  RotateCcw,
  Thermometer,
  Wind,
  X,
} from "lucide-react";

type WeatherRadarModalProps = {
  isOpen: boolean;
  onClose: () => void;
  lat: number;
  lon: number;
  cityName: string;
};

type RadarLayerType = "radar" | "wind" | "rain" | "clouds" | "temp" | "osm";

export default function WeatherRadarModal({
  isOpen,
  onClose,
  lat,
  lon,
  cityName,
}: WeatherRadarModalProps) {
  const [activeLayer, setActiveLayer] = useState<RadarLayerType>("radar");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [radarZoom, setRadarZoom] = useState(7);
  const [iframeKey, setIframeKey] = useState(0);

  // Leaflet map refs for Street Map mode
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Initialize or cleanup Leaflet when in OSM mode
  useEffect(() => {
    if (!isOpen || activeLayer !== "osm" || !mapContainerRef.current) return;

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Check if element already has a Leaflet map
      if ((mapContainerRef.current as any)._leaflet_id) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [lat, lon],
        zoom: 10,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Base CartoDB Voyager Tile Layer
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; <a href="https://openstreetmap.org">OSM</a>, &copy; CARTO',
          maxZoom: 19,
        }
      ).addTo(map);

      // Custom Location Badge Pin
      const pinIcon = L.divIcon({
        className: "custom-radar-pin",
        html: `
          <div style="background-color: #1a2e26; color: #e9ff74; border: 2px solid white; padding: 6px 14px; border-radius: 9999px; font-weight: bold; font-size: 12px; box-shadow: 0 12px 30px rgba(0,0,0,0.35); display: flex; align-items: center; gap: 6px; white-space: nowrap;">
            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:#e9ff74; box-shadow:0 0 10px #e9ff74;"></span>
            <span>${cityName}</span>
          </div>
        `,
        iconSize: [120, 32],
        iconAnchor: [60, 16],
      });

      L.marker([lat, lon], { icon: pinIcon })
        .addTo(map)
        .bindPopup(`<b>${cityName}</b><br/>Lat: ${lat.toFixed(3)}, Lon: ${lon.toFixed(3)}`)
        .openPopup();

      map.invalidateSize();
    }, 120);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, activeLayer, lat, lon, cityName]);

  if (!isOpen) return null;

  // Construct Windy live radar embed URL
  const getWindyUrl = () => {
    const overlayParam =
      activeLayer === "radar"
        ? "radar"
        : activeLayer === "wind"
        ? "wind"
        : activeLayer === "rain"
        ? "rain"
        : activeLayer === "clouds"
        ? "clouds"
        : "temp";

    return `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=100%25&height=100%25&zoom=${radarZoom}&level=surface&overlay=${overlayParam}&product=radar&menu=&message=&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;
  };

  const handleResetLocation = () => {
    setRadarZoom(7);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 md:p-6 backdrop-blur-md animate-[fadeIn_200ms_ease-out]">
      <div
        className={`relative flex flex-col overflow-hidden rounded-3xl border border-[#dfe5e1] bg-[#111c16] shadow-2xl transition-all duration-300 ${
          isFullscreen ? "size-full max-w-none rounded-none" : "h-[90vh] w-full max-w-6xl"
        }`}
      >
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#16251e] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-[#1f342b] text-[#e9ff74] shadow-inner">
              <CloudRain className="size-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white sm:text-base">
                  Live Meteorological Radar & Satellite
                </h3>
                <span className="flex items-center gap-1.5 rounded-full bg-[#e9ff74]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#e9ff74]">
                  <span className="size-1.5 rounded-full bg-[#e9ff74] animate-ping" />
                  Live Doppler
                </span>
              </div>
              <p className="text-xs text-white/60">
                Centered on <strong className="text-white/90">{cityName}</strong> · Coordinates: {lat.toFixed(3)}°, {lon.toFixed(3)}°
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetLocation}
              title="Reset radar view to city center"
              className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/15 hover:text-white"
            >
              <RotateCcw className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/15 hover:text-white"
            >
              {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              title="Close radar modal"
              className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-red-500/20 hover:text-red-400"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Layer Selector Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-white/10 bg-[#122019] px-4 py-2.5 scrollbar-none [scrollbar-width:none]">
          <span className="mr-2 text-[11px] font-bold uppercase tracking-wider text-white/40">
            Weather Layers:
          </span>

          <button
            type="button"
            onClick={() => setActiveLayer("radar")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
              activeLayer === "radar"
                ? "bg-[#e9ff74] text-[#11241c] shadow-sm"
                : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <CloudRain className="size-3.5" />
            <span>Doppler Radar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer("wind")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
              activeLayer === "wind"
                ? "bg-[#38bdf8] text-[#082f49] shadow-sm"
                : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Wind className="size-3.5" />
            <span>Wind Stream</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer("rain")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
              activeLayer === "rain"
                ? "bg-[#60a5fa] text-[#172554] shadow-sm"
                : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <CloudLightning className="size-3.5" />
            <span>Rain & Storms</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer("clouds")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
              activeLayer === "clouds"
                ? "bg-[#cbd5e1] text-[#0f172a] shadow-sm"
                : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Cloud className="size-3.5" />
            <span>Satellite Clouds</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer("temp")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
              activeLayer === "temp"
                ? "bg-[#f59e0b] text-[#451a03] shadow-sm"
                : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Thermometer className="size-3.5" />
            <span>Thermal Heatmap</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer("osm")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
              activeLayer === "osm"
                ? "bg-[#10b981] text-[#064e3b] shadow-sm"
                : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <MapIcon className="size-3.5" />
            <span>Local Street Map</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="relative flex-1 bg-[#0b1410]">
          {activeLayer === "osm" ? (
            /* OpenStreetMap Mode with Leaflet */
            <div ref={mapContainerRef} className="size-full" />
          ) : (
            /* Live Doppler / Satellite / Wind Radar via High Performance Engine */
            <iframe
              key={`${iframeKey}-${activeLayer}`}
              src={getWindyUrl()}
              title={`Live Weather Radar for ${cityName}`}
              className="size-full border-0"
              loading="eager"
              allowFullScreen
            />
          )}

          {/* Radar Intensity Legend Badge */}
          {activeLayer !== "osm" && (
            <div className="pointer-events-none absolute bottom-4 left-4 z-20 rounded-2xl border border-white/15 bg-black/75 p-3 backdrop-blur-md text-white shadow-xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                {activeLayer === "radar"
                  ? "Radar Reflectivity (dBZ)"
                  : activeLayer === "wind"
                  ? "Wind Velocity"
                  : activeLayer === "rain"
                  ? "Precipitation Rate"
                  : activeLayer === "temp"
                  ? "Temperature Spectrum"
                  : "Cloud Thickness"}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-[10px] text-white/60">Light</span>
                <div className="h-2 w-32 rounded-full bg-gradient-to-r from-[#38bdf8] via-[#34d399] via-[#facc15] via-[#f97316] to-[#ef4444]" />
                <span className="text-[10px] text-white/60">Extreme</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

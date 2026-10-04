import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { CloudRain, Layers, Maximize2, X } from "lucide-react";

type WeatherRadarModalProps = {
  isOpen: boolean;
  onClose: () => void;
  lat: number;
  lon: number;
  cityName: string;
};

export default function WeatherRadarModal({
  isOpen,
  onClose,
  lat,
  lon,
  cityName,
}: WeatherRadarModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const radarLayerRef = useRef<L.TileLayer | null>(null);
  const [showRadar, setShowRadar] = useState(true);
  const [radarTimestamp, setRadarTimestamp] = useState<string>("");

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Small timeout to allow modal animation to finish before sizing map
    const timer = setTimeout(async () => {
      if (!mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [lat, lon],
        zoom: 7,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Base OpenStreetMap Layer (CartoDB Positron / OSM clean)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://openstreetmap.org">OSM</a>, &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      // Custom marker icon
      const pinIcon = L.divIcon({
        className: "custom-pin",
        html: `<div style="background-color:#1e342a;color:#e9ff74;padding:6px 12px;border-radius:9999px;font-weight:bold;font-size:12px;box-shadow:0 10px 25px rgba(0,0,0,0.3);border:2px solid white;white-space:nowrap;">📍 ${cityName}</div>`,
        iconSize: [80, 30],
        iconAnchor: [40, 15],
      });

      L.marker([lat, lon], { icon: pinIcon }).addTo(map);

      // Fetch latest RainViewer radar layer
      try {
        const rvRes = await fetch("https://api.rainviewer.com/public/weather-maps.json");
        if (rvRes.ok) {
          const rvData = await rvRes.json();
          const host = rvData.host || "https://tilecache.rainviewer.com";
          const latestPath = rvData.radar?.past?.slice(-1)[0]?.path;
          const timeVal = rvData.radar?.past?.slice(-1)[0]?.time;

          if (latestPath) {
            if (timeVal) {
              setRadarTimestamp(new Date(timeVal * 1000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
            }
            const radarUrl = `${host}${latestPath}/256/{z}/{x}/{y}/2/1_1.png`;
            const radar = L.tileLayer(radarUrl, {
              opacity: 0.72,
              zIndex: 100,
            });
            radarLayerRef.current = radar;
            if (showRadar) {
              radar.addTo(map);
            }
          }
        }
      } catch {
        // radar fallback
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, lat, lon, cityName]);

  // Toggle radar layer visibility
  const toggleRadar = () => {
    if (!mapInstanceRef.current || !radarLayerRef.current) return;
    if (showRadar) {
      mapInstanceRef.current.removeLayer(radarLayerRef.current);
      setShowRadar(false);
    } else {
      radarLayerRef.current.addTo(mapInstanceRef.current);
      setShowRadar(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6 backdrop-blur-md animate-[fadeIn_200ms_ease-out]">
      <div className="relative flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#dfe5e1] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5ebe7] bg-[#fbfcf9] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#1e342a] text-[#e9ff74]">
              <CloudRain className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#18221d]">
                Live Weather & Precipitation Radar
              </h3>
              <p className="text-xs text-[#6e7f77]">
                {cityName} · {radarTimestamp ? `Radar snapshot ${radarTimestamp}` : "Satellite precipitation scan"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleRadar}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                showRadar
                  ? "border-[#1e342a] bg-[#1e342a] text-[#e9ff74]"
                  : "border-[#d8ded9] bg-white text-[#45584f] hover:bg-[#f2f6f3]"
              }`}
            >
              <Layers className="size-3.5" />
              <span>{showRadar ? "Radar: ON" : "Radar: OFF"}</span>
            </button>

            <button
              onClick={onClose}
              title="Close radar map"
              className="rounded-full p-2 text-[#73837b] transition hover:bg-[#ebf0ec] hover:text-[#18221d]"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative flex-1">
          <div ref={mapContainerRef} className="size-full" />

          {/* Map legend bottom left */}
          <div className="absolute bottom-4 left-4 z-[400] rounded-2xl border border-white/40 bg-white/90 p-3 shadow-lg backdrop-blur-md">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#697b72]">
              Precipitation Intensity
            </p>
            <div className="mt-1.5 flex items-center gap-1">
              <span className="text-[10px] text-[#73837b]">Light</span>
              <div className="h-2 w-28 rounded-full bg-gradient-to-r from-[#60a5fa] via-[#34d399] via-[#f59e0b] to-[#dc2626]" />
              <span className="text-[10px] text-[#73837b]">Heavy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

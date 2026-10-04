import { Volume2, VolumeX, Waves } from "lucide-react";
import { useState } from "react";
import { soundSynthesizer } from "../services/soundService";

type AmbientSoundPlayerProps = {
  weatherMain?: string;
};

export default function AmbientSoundPlayer({ weatherMain = "Clear" }: AmbientSoundPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [selectedSound, setSelectedSound] = useState<"rain" | "wind" | "calm">(() => {
    const lower = weatherMain.toLowerCase();
    if (lower.includes("rain") || lower.includes("drizzle")) return "rain";
    if (lower.includes("wind") || lower.includes("storm")) return "wind";
    return "calm";
  });

  const handleToggle = () => {
    if (isPlaying) {
      soundSynthesizer.stop();
      setIsPlaying(false);
    } else {
      soundSynthesizer.play(selectedSound, volume);
      setIsPlaying(true);
    }
  };

  const handleSoundChange = (type: "rain" | "wind" | "calm") => {
    setSelectedSound(type);
    if (isPlaying) {
      soundSynthesizer.play(type, volume);
    }
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    soundSynthesizer.setVolume(v);
  };

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-black/20 px-3 py-1.5 backdrop-blur-md text-white text-xs">
      <button
        type="button"
        onClick={handleToggle}
        title={isPlaying ? "Mute ambient audio" : "Play ambient weather soundscape"}
        className="flex items-center gap-1.5 transition hover:text-[#e9ff74]"
      >
        {isPlaying ? (
          <Volume2 className="size-3.5 text-[#e9ff74] animate-pulse" />
        ) : (
          <VolumeX className="size-3.5 opacity-70" />
        )}
        <span className="font-semibold hidden sm:inline">
          {isPlaying ? "Ambient Sound" : "Audio"}
        </span>
      </button>

      {isPlaying && (
        <div className="flex items-center gap-2 pl-1 border-l border-white/20 animate-[fadeIn_200ms_ease-out]">
          <select
            value={selectedSound}
            onChange={(e) => handleSoundChange(e.target.value as any)}
            className="rounded-lg bg-black/40 px-1.5 py-0.5 text-[11px] font-medium text-white outline-none"
          >
            <option value="rain" className="bg-[#18221d]">Rain</option>
            <option value="wind" className="bg-[#18221d]">Wind</option>
            <option value="calm" className="bg-[#18221d]">Breeze</option>
          </select>

          <input
            type="range"
            min="0.05"
            max="0.8"
            step="0.05"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-14 accent-[#e9ff74] cursor-pointer"
            title="Volume"
          />
        </div>
      )}
    </div>
  );
}

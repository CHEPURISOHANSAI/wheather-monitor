import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Snowflake,
  CloudFog,
} from "lucide-react";
import { WeatherCondition } from "../types/weather";

type WeatherIconProps = {
  condition: WeatherCondition;
  className?: string;
  isDay?: boolean;
};

export default function WeatherIcon({ condition, className = "size-6", isDay = true }: WeatherIconProps) {
  switch (condition.iconName) {
    case "sun":
      return <Sun className={`${className} text-[#facc15] animate-[spin_20s_linear_infinite]`} />;
    case "moon":
      return <Moon className={`${className} text-[#93c5fd]`} />;
    case "cloud-sun":
      return isDay ? (
        <CloudSun className={`${className} text-[#fef08a]`} />
      ) : (
        <CloudMoon className={`${className} text-[#bae6fd]`} />
      );
    case "cloud-moon":
      return <CloudMoon className={`${className} text-[#bae6fd]`} />;
    case "cloud":
      return <Cloud className={`${className} text-[#cbd5e1]`} />;
    case "cloud-rain":
      return <CloudRain className={`${className} text-[#60a5fa]`} />;
    case "cloud-drizzle":
      return <CloudDrizzle className={`${className} text-[#7dd3fc]`} />;
    case "cloud-lightning":
      return <CloudLightning className={`${className} text-[#fde047]`} />;
    case "snowflake":
      return <Snowflake className={`${className} text-[#e0f2fe]`} />;
    case "cloud-fog":
      return <CloudFog className={`${className} text-[#cbd5e1]`} />;
    default:
      return <Cloud className={`${className} text-[#cbd5e1]`} />;
  }
}

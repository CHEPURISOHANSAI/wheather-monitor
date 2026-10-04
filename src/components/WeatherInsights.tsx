import {
  AlertTriangle,
  Flame,
  Info,
  Lightbulb,
  ShieldCheck,
  Shirt,
  Sparkles,
  Sun,
  Umbrella,
  Wind,
} from "lucide-react";
import { WeatherInsight } from "../types/weather";

type WeatherInsightsProps = {
  insights: WeatherInsight[];
};

export default function WeatherInsights({ insights }: WeatherInsightsProps) {
  if (!insights || insights.length === 0) return null;

  const getIcon = (type: WeatherInsight["type"]) => {
    switch (type) {
      case "umbrella":
        return <Umbrella className="size-4.5 text-[#0284c7]" />;
      case "sunscreen":
        return <Sun className="size-4.5 text-[#f59e0b]" />;
      case "clothing":
        return <Shirt className="size-4.5 text-[#8b5cf6]" />;
      case "wind":
        return <Wind className="size-4.5 text-[#0d9488]" />;
      case "sport":
        return <Sparkles className="size-4.5 text-[#10b981]" />;
      case "air":
        return <Flame className="size-4.5 text-[#ef4444]" />;
      default:
        return <Lightbulb className="size-4.5 text-[#eab308]" />;
    }
  };

  const getSeverityBadge = (sev: WeatherInsight["severity"]) => {
    switch (sev) {
      case "warning":
        return (
          <span className="flex items-center gap-1 rounded-full bg-[#fef2f2] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#dc2626]">
            <AlertTriangle className="size-3" />
            Alert
          </span>
        );
      case "advisory":
        return (
          <span className="flex items-center gap-1 rounded-full bg-[#fffbeb] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#d97706]">
            <Info className="size-3" />
            Advisory
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 rounded-full bg-[#f0fdf4] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#16a34a]">
            <ShieldCheck className="size-3" />
            Tip
          </span>
        );
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between border-b border-[#dfe5e1] pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[#4f6b5d]" />
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#74827a]">
            Smart Insights & Advisory
          </p>
        </div>
        <span className="text-xs font-semibold text-[#8a9890]">Personalized Guidance</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {insights.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-[#dfe5e1] bg-white/75 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#cad4ce] hover:bg-white shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-xl bg-[#eef4f0]">
                    {getIcon(item.type)}
                  </div>
                  <h4 className="text-sm font-bold text-[#18221d]">{item.title}</h4>
                </div>
                {getSeverityBadge(item.severity)}
              </div>
              <p className="mt-2.5 text-xs leading-5 text-[#5e6f66]">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

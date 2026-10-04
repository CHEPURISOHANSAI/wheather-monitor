export function getMoonPhase(date = new Date()): { name: string; illumination: number; icon: string } {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();

  let adjustedYear = year;
  let adjustedMonth = month;

  if (month < 3) {
    adjustedYear--;
    adjustedMonth += 12;
  }

  const c = 365.25 * adjustedYear;
  const e = 30.6 * adjustedMonth;
  let jd = c + e + day - 694039.09;
  jd /= 29.5305882;
  const b = Math.floor(jd);
  jd -= b;

  const phaseIndex = Math.round(jd * 8) % 8;
  const illumination = Math.round(((1 - Math.cos(jd * 2 * Math.PI)) / 2) * 100);

  const phaseNames = [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
    "Full Moon",
    "Waning Gibbous",
    "Last Quarter",
    "Waning Crescent",
  ];

  const phaseIcons = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];

  return {
    name: phaseNames[phaseIndex] || "Full Moon",
    illumination,
    icon: phaseIcons[phaseIndex] || "🌕",
  };
}

export function calculateDayProgress(
  sunriseStr: string,
  sunsetStr: string,
  isDay: boolean
): { dayLengthText: string; progressPercent: number } {
  try {
    // Parse times like "06:15 AM", "06:45 PM"
    function parseTimeToMinutes(tStr: string): number {
      const match = tStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (!match) return 360;
      let h = parseInt(match[1]);
      const m = parseInt(match[2]);
      const period = match[3]?.toUpperCase();
      if (period === "PM" && h < 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      return h * 60 + m;
    }

    const sunriseMin = parseTimeToMinutes(sunriseStr);
    const sunsetMin = parseTimeToMinutes(sunsetStr);

    let daylightMins = sunsetMin - sunriseMin;
    if (daylightMins < 0) daylightMins += 24 * 60;

    const hours = Math.floor(daylightMins / 60);
    const mins = daylightMins % 60;
    const dayLengthText = `${hours}h ${mins}m`;

    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    let progressPercent = 0;
    if (currentMins <= sunriseMin) {
      progressPercent = 0;
    } else if (currentMins >= sunsetMin) {
      progressPercent = 100;
    } else {
      progressPercent = Math.round(((currentMins - sunriseMin) / daylightMins) * 100);
    }

    return { dayLengthText, progressPercent: Math.max(0, Math.min(100, progressPercent)) };
  } catch {
    return { dayLengthText: "12h 15m", progressPercent: isDay ? 50 : 0 };
  }
}

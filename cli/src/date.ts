const DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export function parseDate(input: string): Date {
  const lower = input.toLowerCase();
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Amsterdam" }));

  if (lower === "today") return startOfDay(now);
  if (lower === "tomorrow") return addDays(startOfDay(now), 1);
  if (lower === "yesterday") return addDays(startOfDay(now), -1);

  const dayIdx = DAY_NAMES.indexOf(lower);
  if (dayIdx !== -1) {
    const current = now.getDay();
    let diff = dayIdx - current;
    if (diff <= 0) diff += 7;
    return addDays(startOfDay(now), diff);
  }

  // YYYY-MM-DD
  const parsed = new Date(input + "T00:00:00");
  if (isNaN(parsed.getTime())) throw new Error(`Invalid date: ${input}`);
  return parsed;
}

export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(d: Date, n: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + n);
  return result;
}

function startOfDay(d: Date): Date {
  const result = new Date(d);
  result.setHours(0, 0, 0, 0);
  return result;
}

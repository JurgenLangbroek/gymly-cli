import { get } from "../client.js";
import { parseDate, formatDate, addDays } from "../date.js";

export async function schedule(dateStr?: string, week?: boolean): Promise<unknown> {
  const start = dateStr ? parseDate(dateStr) : parseDate("today");
  const lastDay = week ? addDays(start, 6) : start;
  const end = addDays(lastDay, 1);

  const startDate = formatDate(start);
  const endDate = formatDate(end);

  return get(`/schedule?startDate=${startDate}&endDate=${endDate}`);
}

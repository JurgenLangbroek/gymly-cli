import { post } from "../client.js";
import { parseDate, formatDate } from "../date.js";

function toISODate(dateStr: string): string {
  const d = parseDate(dateStr);
  return `${formatDate(d)}T00:00:00Z`;
}

export async function book(courseId: string, dateStr: string): Promise<unknown> {
  return post("/book", { courseId, date: toISODate(dateStr) });
}

export async function cancel(courseId: string, dateStr: string): Promise<unknown> {
  return post("/cancel", { courseId, date: toISODate(dateStr) });
}

export async function joinWaitlist(courseId: string, dateStr: string): Promise<unknown> {
  return post("/waitlist", { courseId, date: toISODate(dateStr) });
}

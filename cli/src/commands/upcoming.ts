import { get } from "../client.js";

export async function upcoming(): Promise<unknown> {
  return get("/upcoming");
}

export async function waitlist(): Promise<unknown> {
  return get("/waitlist");
}

export async function members(courseId: string, date: string): Promise<unknown> {
  return get(`/members/${encodeURIComponent(courseId)}?date=${date}`);
}

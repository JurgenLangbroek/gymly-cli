import { apiGet } from "../gymly-client";
import { BUSINESS_ID, LOCATION_ID } from "../config";

export async function handleSchedule(path: string, req: Request, url: URL): Promise<Response | null> {
  if (path !== "/schedule" || req.method !== "GET") return null;

  const profile = url.searchParams.get("profile") || "default";
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  if (!startDate || !endDate) {
    return Response.json({ error: "startDate and endDate required" }, { status: 400 });
  }

  const params = new URLSearchParams({ startDate, endDate });
  const result = (await apiGet(
    `/api/v1/businesses/${BUSINESS_ID}/activity-events?${params}`,
    profile,
  )) as any[];

  const filtered = result.filter((e: any) => e.businessLocationId === LOCATION_ID);
  filtered.sort((a: any, b: any) => (a.startAt || "").localeCompare(b.startAt || ""));

  const formatted = filtered.map((event: any) => ({
    id: event.id,
    date: event.startAt?.slice(0, 10) || "",
    time: `${formatTime(event.startAtLocal)}–${formatTime(event.endAtLocal)}`,
    name: event.name || "Unknown",
    instructor: event.teachers?.map((t: any) => t.fullName).join(", ") || "",
    spots: event.showMemberCount ? `${event.memberCount ?? 0}/${event.capacity}` : "",
    status: event.status || "",
  }));

  return Response.json(formatted);
}

function formatTime(iso: string): string {
  if (!iso) return "";
  const match = iso.match(/T(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : iso;
}

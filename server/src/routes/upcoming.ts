import { apiGet } from "../gymly-client";
import { BUSINESS_ID } from "../config";

export async function handleUpcoming(path: string, req: Request, url: URL): Promise<Response | null> {
  const profile = url.searchParams.get("profile") || "default";

  if (path === "/upcoming" && req.method === "GET") {
    const result = (await apiGet(
      `/api/v1/user/businesses/${BUSINESS_ID}/courses/upcoming?page=0&size=50`,
      profile,
    )) as any;
    const items = result.content || [];
    const formatted = items.map((item: any) => {
      const c = item.courseDetails || {};
      return {
        id: c.id,
        date: c.startAt?.slice(0, 10) || "",
        time:
          c.startAt && c.endAt
            ? `${formatTime(c.startAt, c.utcOffset)}–${formatTime(c.endAt, c.utcOffset)}`
            : "",
        name: c.name || "",
        location: c.businessLocation?.name || "",
        spots: c.showMemberCount ? `${c.memberCount ?? 0}/${c.capacity}` : "",
        status: item.status || c.status || "",
      };
    });
    return Response.json(formatted);
  }

  if (path === "/waitlist" && req.method === "GET") {
    const result = (await apiGet(
      `/api/v1/businesses/${BUSINESS_ID}/courses/waitlist?page=1&size=50`,
      profile,
    )) as any;
    return Response.json(result.content || []);
  }

  const membersMatch = path.match(/^\/members\/(.+)$/);
  if (membersMatch && req.method === "GET") {
    const courseId = membersMatch[1];
    const date = url.searchParams.get("date");
    if (!date) {
      return Response.json({ error: "date query param required" }, { status: 400 });
    }
    const result = (await apiGet(
      `/api/v1/courses/${encodeURIComponent(courseId)}/members?date=${date}`,
      profile,
    )) as any[];
    const formatted = result.map((m: any) => ({
      name: m.fullName || m.firstName || "Anonymous",
      status: m.status || "",
      attended: m.attended ?? "",
    }));
    return Response.json(formatted);
  }

  return null;
}

function formatTime(utc: string, utcOffset?: number): string {
  const d = new Date(utc);
  const offset = utcOffset ?? 1;
  const hours = d.getUTCHours() + offset;
  const mins = d.getUTCMinutes();
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

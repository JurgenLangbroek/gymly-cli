import { apiPost } from "../gymly-client";

export async function handleBook(path: string, req: Request, url: URL): Promise<Response | null> {
  const profile = url.searchParams.get("profile") || "default";

  if (path === "/book" && req.method === "POST") {
    const { courseId, date } = (await req.json()) as { courseId: string; date: string };
    if (!courseId || !date) {
      return Response.json({ error: "courseId and date required" }, { status: 400 });
    }
    const result = await apiPost(
      `/api/v1/courses/${encodeURIComponent(courseId)}/subscribe`,
      { date },
      profile,
    );
    return Response.json(result);
  }

  if (path === "/cancel" && req.method === "POST") {
    const { courseId, date } = (await req.json()) as { courseId: string; date: string };
    if (!courseId || !date) {
      return Response.json({ error: "courseId and date required" }, { status: 400 });
    }
    const result = await apiPost(
      `/api/v1/courses/${encodeURIComponent(courseId)}/unsubscribe`,
      { date },
      profile,
    );
    return Response.json(result);
  }

  if (path === "/waitlist" && req.method === "POST") {
    const { courseId, date } = (await req.json()) as { courseId: string; date: string };
    if (!courseId || !date) {
      return Response.json({ error: "courseId and date required" }, { status: 400 });
    }
    const result = await apiPost(
      `/api/v1/courses/${encodeURIComponent(courseId)}/waitlist`,
      { date },
      profile,
    );
    return Response.json(result);
  }

  return null;
}

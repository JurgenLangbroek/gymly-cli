import { handleAuth } from "./routes/auth";
import { handleSchedule } from "./routes/schedule";
import { handleBook } from "./routes/book";
import { handleUpcoming } from "./routes/upcoming";
import { handleCheckin } from "./routes/checkin";
import { handleNotifications } from "./routes/notifications";
import { handleMemberships } from "./routes/memberships";
import { errorResponse } from "./middleware/error-handler";

const handlers = [
  handleAuth,
  handleSchedule,
  handleBook,
  handleUpcoming,
  handleCheckin,
  handleNotifications,
  handleMemberships,
];

export async function route(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  if (path === "/health") return Response.json({ ok: true });

  try {
    for (const handler of handlers) {
      const response = await handler(path, req, url);
      if (response) return response;
    }
    return Response.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    return errorResponse(error);
  }
}

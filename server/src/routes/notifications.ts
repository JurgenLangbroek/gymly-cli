import { apiGet } from "../gymly-client";
import { BUSINESS_ID } from "../config";

export async function handleNotifications(path: string, req: Request, url: URL): Promise<Response | null> {
  if (path !== "/notifications" || req.method !== "GET") return null;

  const profile = url.searchParams.get("profile") || "default";
  const result = await apiGet(`/api/v1/user/businesses/${BUSINESS_ID}/notifications`, profile);
  return Response.json(result);
}

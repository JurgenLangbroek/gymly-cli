import { apiGet } from "../gymly-client";
import { BUSINESS_ID } from "../config";

export async function handleCheckin(path: string, req: Request, url: URL): Promise<Response | null> {
  if (path !== "/checkin" || req.method !== "GET") return null;

  const profile = url.searchParams.get("profile") || "default";
  const result = await apiGet(`/api/v2/user/businesses/${BUSINESS_ID}/checkin`, profile);
  return Response.json(result);
}

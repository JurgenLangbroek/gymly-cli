import { apiGet } from "../gymly-client";
import { BUSINESS_ID } from "../config";

export async function handleMemberships(path: string, req: Request, url: URL): Promise<Response | null> {
  if (path !== "/memberships" || req.method !== "GET") return null;

  const profile = url.searchParams.get("profile") || "default";
  const result = await apiGet(`/api/v1/users/me/businesses/${BUSINESS_ID}/memberships`, profile);
  return Response.json(result);
}

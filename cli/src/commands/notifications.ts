import { get } from "../client.js";

export async function notifications(): Promise<unknown> {
  return get("/notifications");
}

import { get } from "../client.js";

export async function memberships(): Promise<unknown> {
  return get("/memberships");
}

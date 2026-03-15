import { get } from "../client.js";

export async function checkin(): Promise<unknown> {
  return get("/checkin");
}

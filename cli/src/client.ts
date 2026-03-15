const BASE_URL = process.env.GYMLY_API_URL || "http://localhost:3200";

let currentProfile = "default";

export function setProfile(profile: string): void {
  currentProfile = profile;
}

function appendProfile(path: string): string {
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}profile=${encodeURIComponent(currentProfile)}`;
}

export async function get(path: string): Promise<unknown> {
  const res = await fetch(`${BASE_URL}${appendProfile(path)}`);
  const body = await res.json() as Record<string, unknown>;
  if (!res.ok) throw new Error((body.error as string) || `HTTP ${res.status}`);
  return body;
}

export async function post(path: string, data?: unknown): Promise<unknown> {
  const res = await fetch(`${BASE_URL}${appendProfile(path)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
  });
  const body = await res.json() as Record<string, unknown>;
  if (!res.ok) throw new Error((body.error as string) || `HTTP ${res.status}`);
  return body;
}

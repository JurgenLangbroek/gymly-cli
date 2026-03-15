import { mkdir, readFile, writeFile, unlink, readdir } from "fs/promises";
import { BASE_URL } from "./config";

const PROFILES_DIR = "/data/profiles";

interface ProfileData {
  token: string;
  user?: { firstName?: string; lastName?: string };
}

const profiles = new Map<string, ProfileData>();

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

function profilePath(name: string): string {
  return `${PROFILES_DIR}/${name}.json`;
}

async function saveProfile(name: string, data: ProfileData): Promise<void> {
  await mkdir(PROFILES_DIR, { recursive: true });
  await writeFile(profilePath(name), JSON.stringify(data, null, 2));
  profiles.set(name, data);
}

async function deleteProfile(name: string): Promise<void> {
  try {
    await unlink(profilePath(name));
  } catch {
    // already gone
  }
  profiles.delete(name);
}

export async function initClient(): Promise<void> {
  try {
    await mkdir(PROFILES_DIR, { recursive: true });
    const files = await readdir(PROFILES_DIR);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const name = file.replace(/\.json$/, "");
      try {
        const raw = await readFile(`${PROFILES_DIR}/${file}`, "utf-8");
        const data = JSON.parse(raw) as ProfileData;
        // Validate token
        const res = await fetch(`${BASE_URL}/api/v1/user/me`, {
          headers: { Authorization: `Bearer ${data.token}`, Accept: "application/json" },
        });
        if (res.ok) {
          const user = (await res.json()) as { firstName?: string; lastName?: string };
          data.user = user;
          profiles.set(name, data);
          console.log(`Profile "${name}" loaded (${user.firstName} ${user.lastName})`);
        } else {
          console.log(`Profile "${name}" token expired, removing`);
          await deleteProfile(name);
        }
      } catch (err) {
        console.log(`Profile "${name}" failed to load: ${err}`);
      }
    }
  } catch {
    // No profiles dir yet
  }
  console.log(`${profiles.size} profile(s) active`);
}

export function isAuthenticated(profile: string = "default"): boolean {
  return profiles.has(profile);
}

export function getToken(profile: string = "default"): string {
  const data = profiles.get(profile);
  if (!data) throw new AuthError(`Profile "${profile}" not authenticated`);
  return data.token;
}

export function getProfileUser(profile: string = "default"): ProfileData["user"] | undefined {
  return profiles.get(profile)?.user;
}

export function listProfiles(): { name: string; authenticated: boolean; user?: string }[] {
  const result: { name: string; authenticated: boolean; user?: string }[] = [];
  for (const [name, data] of profiles) {
    result.push({
      name,
      authenticated: true,
      user: data.user ? `${data.user.firstName} ${data.user.lastName}` : undefined,
    });
  }
  return result;
}

export async function login(email: string, password: string, profile: string = "default"): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/api/v1/user/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const text = await res.text();
  const result = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(result.message || result.error || `HTTP ${res.status}`);
  }
  if (result.jwt) {
    const user = result.me as { firstName?: string; lastName?: string } | undefined;
    await saveProfile(profile, { token: result.jwt, user });
    return { status: "authenticated", profile, user };
  }
  return result;
}

export async function logout(profile: string = "default"): Promise<{ status: string }> {
  await deleteProfile(profile);
  return { status: "logged out", profile } as { status: string };
}

// Proxied API helpers
export async function apiGet(path: string, profile: string = "default"): Promise<unknown> {
  const token = getToken(profile);
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!res.ok) {
    const body = await res.text();
    try {
      const json = JSON.parse(body);
      throw new Error(json.message || json.error || `HTTP ${res.status}`);
    } catch (e) {
      if (e instanceof Error && e.message !== body) throw e;
      throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
    }
  }
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

export async function apiPost(path: string, data?: unknown, profile: string = "default"): Promise<unknown> {
  const token = getToken(profile);
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
  });
  if (!res.ok) {
    const body = await res.text();
    try {
      const json = JSON.parse(body);
      throw new Error(json.message || json.error || `HTTP ${res.status}`);
    } catch (e) {
      if (e instanceof Error && e.message !== body) throw e;
      throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
    }
  }
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

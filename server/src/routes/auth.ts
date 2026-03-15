import { isAuthenticated, login, logout, listProfiles, getProfileUser, apiGet } from "../gymly-client";

export async function handleAuth(path: string, req: Request, url: URL): Promise<Response | null> {
  const profile = url.searchParams.get("profile") || "default";

  if (path === "/auth/status" && req.method === "GET") {
    if (isAuthenticated(profile)) {
      const user = getProfileUser(profile);
      return Response.json({
        status: "authenticated",
        profile,
        name: user ? `${user.firstName} ${user.lastName}` : undefined,
      });
    }
    return Response.json({ status: "unauthenticated", profile });
  }

  if (path === "/auth/login" && req.method === "POST") {
    const { email, password } = (await req.json()) as { email: string; password: string };
    if (!email || !password) {
      return Response.json({ error: "email and password required" }, { status: 400 });
    }
    const result = await login(email, password, profile);
    return Response.json(result);
  }

  if (path === "/auth/logout" && req.method === "POST") {
    const result = await logout(profile);
    return Response.json(result);
  }

  if (path === "/auth/profiles" && req.method === "GET") {
    return Response.json(listProfiles());
  }

  if (path === "/auth/me" && req.method === "GET") {
    const result = await apiGet("/api/v1/user/me", profile);
    return Response.json(result);
  }

  return null;
}

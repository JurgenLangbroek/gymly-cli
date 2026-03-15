import { get, post } from "../client.js";

export async function login(email: string, password: string): Promise<unknown> {
  return post("/auth/login", { email, password });
}

export async function logout(): Promise<unknown> {
  return post("/auth/logout");
}

export async function status(): Promise<unknown> {
  return get("/auth/status");
}

export async function me(): Promise<unknown> {
  return get("/auth/me");
}

export async function profiles(): Promise<unknown> {
  return get("/auth/profiles");
}

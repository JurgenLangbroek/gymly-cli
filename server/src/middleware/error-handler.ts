import { AuthError } from "../gymly-client";

export function errorResponse(error: unknown): Response {
  if (error instanceof AuthError) {
    return Response.json({ error: error.message }, { status: 401 });
  }

  const message = error instanceof Error ? error.message : "Internal server error";
  console.error("Request error:", message);
  return Response.json({ error: message }, { status: 500 });
}

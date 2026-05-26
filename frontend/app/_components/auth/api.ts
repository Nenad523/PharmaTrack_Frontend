import { normalizeAuthUser } from "./types";
import { apiUrl } from "@/lib/api";

function getAuthUrl(path: string) {
  return apiUrl(`/api/v1/auth/${path}`);
}

let cachedCsrfToken: string | null = null;

export function clearCachedCsrfToken() {
  cachedCsrfToken = null;
}

export async function getCsrfToken(forceRefresh = false): Promise<string> {
  if (forceRefresh) {
    cachedCsrfToken = null;
  }

  if (cachedCsrfToken) return cachedCsrfToken;

  const response = await fetch(getAuthUrl("csrf-token"), {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch CSRF token");

  const data = await response.json();

  if (typeof data.csrfToken !== "string" || !data.csrfToken) {
    throw new Error("CSRF token is not available");
  }

  cachedCsrfToken = data.csrfToken;
  return data.csrfToken;
}

export async function getAuthUserFromResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return normalizeAuthUser(JSON.parse(text));
  } catch {
    return null;
  }
}

export async function fetchCurrentUser() {
  const response = await fetch(getAuthUrl("me"), {
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  return getAuthUserFromResponse(response);
}

export async function loginUser(email: string, password: string) {
  clearCachedCsrfToken();

  return fetch(getAuthUrl("login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutUser() {
  const csrfToken = await getCsrfToken();

  const response = await fetch(getAuthUrl("logout"), {
    method: "POST",
    credentials: "include",
    headers: { "X-CSRF-Token": csrfToken },
  });

  clearCachedCsrfToken();

  if (!response.ok) {
    throw new Error("Logout failed");
  }
}

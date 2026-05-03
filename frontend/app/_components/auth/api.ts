import { normalizeAuthUser } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthUrl(path: string) {
  return `${API_URL}/api/v1/auth/${path}`;
}

let cachedCsrfToken: string | null = null;

async function getCsrfToken(): Promise<string> {
  if (cachedCsrfToken) return cachedCsrfToken;

  const response = await fetch(getAuthUrl("csrf-token"), {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch CSRF token");

  const data = await response.json();
  cachedCsrfToken = data.csrfToken as string;
  return cachedCsrfToken;
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
  if (!API_URL) {
    return null;
  }

  const response = await fetch(getAuthUrl("me"), {
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  return getAuthUserFromResponse(response);
}

export async function loginUser(email: string, password: string) {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  // Login is CSRF-exempt on the backend (no session yet), but fetching the
  // token here ensures cachedCsrfToken is populated for subsequent calls.
  try { cachedCsrfToken = null; await getCsrfToken(); } catch { /* ignore */ }

  return fetch(getAuthUrl("login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutUser() {
  if (!API_URL) {
    return;
  }

  const csrfToken = await getCsrfToken();

  const response = await fetch(getAuthUrl("logout"), {
    method: "POST",
    credentials: "include",
    headers: { "X-CSRF-Token": csrfToken },
  });

  cachedCsrfToken = null;

  if (!response.ok) {
    throw new Error("Logout failed");
  }
}

import { normalizeAuthUser } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthUrl(path: string) {
  return `${API_URL}/api/v1/auth/${path}`;
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

  const response = await fetch(getAuthUrl("logout"), {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
}

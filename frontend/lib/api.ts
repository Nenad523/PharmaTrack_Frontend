const DEFAULT_API_BASE_URL = "http://localhost:3001";

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const API_BASE_URL = stripTrailingSlash(
  process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_BASE_URL
);

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

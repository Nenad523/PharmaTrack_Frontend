const DEFAULT_API_BASE_URL = "http://localhost:3001";

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const configuredApiBaseUrl = stripTrailingSlash(
  process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_BASE_URL
);

const isLoopbackHost = (hostname: string) =>
  hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

const isPrivateNetworkHost = (hostname: string) =>
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
  /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
  /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(hostname);

export const getApiBaseUrl = () => {
  if (typeof window === "undefined") {
    return configuredApiBaseUrl;
  }

  const pageHost = window.location.hostname;

  if (!isPrivateNetworkHost(pageHost)) {
    return configuredApiBaseUrl;
  }

  try {
    const apiUrl = new URL(configuredApiBaseUrl);

    if (isLoopbackHost(apiUrl.hostname)) {
      apiUrl.hostname = pageHost;
      return stripTrailingSlash(apiUrl.toString());
    }
  } catch {
    return configuredApiBaseUrl;
  }

  return configuredApiBaseUrl;
};

export const API_BASE_URL = configuredApiBaseUrl;

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
};

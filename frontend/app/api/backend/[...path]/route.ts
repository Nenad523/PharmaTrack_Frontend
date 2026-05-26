import { NextRequest } from "next/server";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(
  /\/+$/,
  ""
);

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

const buildTargetUrl = async (request: NextRequest, context: RouteContext) => {
  const { path } = await context.params;
  const sourceUrl = new URL(request.url);
  const targetUrl = new URL(`${API_BASE_URL}/${path.join("/")}`);
  targetUrl.search = sourceUrl.search;

  return targetUrl;
};

const buildRequestHeaders = (request: NextRequest) => {
  const headers = new Headers(request.headers);

  for (const header of HOP_BY_HOP_HEADERS) {
    headers.delete(header);
  }

  return headers;
};

const buildResponseHeaders = (sourceHeaders: Headers) => {
  const headers = new Headers();

  sourceHeaders.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  return headers;
};

async function proxy(request: NextRequest, context: RouteContext) {
  const targetUrl = await buildTargetUrl(request, context);
  const method = request.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";

  const response = await fetch(targetUrl, {
    method,
    headers: buildRequestHeaders(request),
    body: hasBody ? await request.arrayBuffer() : undefined,
    redirect: "manual",
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: buildResponseHeaders(response.headers),
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;

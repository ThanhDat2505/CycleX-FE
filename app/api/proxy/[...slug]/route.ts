import { NextRequest, NextResponse } from "next/server";

/**
 * Explicit API proxy route handler.
 *
 * Why this exists instead of relying on `next.config.ts` rewrites:
 * Next.js rewrites forward the browser's cookies to the destination server.
 * If the Spring Boot backend has CSRF protection enabled (the default), any
 * state-changing request (POST/PUT/DELETE) that arrives **with** a session
 * cookie but **without** a matching CSRF token is rejected with 403 Forbidden.
 * GET requests are unaffected because CSRF filters consider them "safe".
 *
 * This route handler makes a **clean** server-to-server fetch that includes
 * only the Authorization and Content-Type headers — no cookies, no CSRF
 * issues.  It also forwards query-string parameters.
 */

const API_HOST = process.env.API_PROXY_TARGET ?? "http://localhost:4491";

async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
): Promise<NextResponse> {
  const { slug } = await params;
  const backendPath = "/api/" + slug.join("/");

  // Preserve query string
  const qs = request.nextUrl.search; // includes leading "?" if present
  const url = `${API_HOST}${backendPath}${qs}`;

  // Only forward the headers that the backend actually needs
  const headers: Record<string, string> = {};

  const authorization = request.headers.get("Authorization");
  if (authorization) headers["Authorization"] = authorization;

  const contentType = request.headers.get("Content-Type");
  if (contentType) headers["Content-Type"] = contentType;

  // Read body for non-GET/HEAD methods
  let body: string | undefined;
  if (!["GET", "HEAD"].includes(request.method)) {
    body = await request.text();
  }

  try {
    const upstream = await fetch(url, {
      method: request.method,
      headers,
      body,
    });

    // Stream the upstream response back to the browser
    const responseHeaders = new Headers();
    const upstreamCT = upstream.headers.get("Content-Type");
    if (upstreamCT) responseHeaders.set("Content-Type", upstreamCT);

    // For error responses, include the body so the client can read the message
    const responseBody = upstream.body;

    return new NextResponse(responseBody, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Proxy: upstream unreachable";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string[] }> },
) {
  return proxyRequest(req, ctx);
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string[] }> },
) {
  return proxyRequest(req, ctx);
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string[] }> },
) {
  return proxyRequest(req, ctx);
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string[] }> },
) {
  return proxyRequest(req, ctx);
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string[] }> },
) {
  return proxyRequest(req, ctx);
}

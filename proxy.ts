import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

function unauthorizedResponse() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Area"',
    },
  });
}

function isProtectedAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isProtectedAdminApiPath(pathname: string) {
  return pathname.startsWith("/api/admin/");
}

function decodeBase64(value: string) {
  try {
    return atob(value);
  } catch {
    return "";
  }
}

function isAuthorized(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedUser = process.env.ADMIN_BASIC_USER;
  const expectedPass = process.env.ADMIN_BASIC_PASS;

  if (!expectedUser || !expectedPass) {
    return false;
  }

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return false;
  }

  const base64 = authHeader.split(" ")[1] || "";
  const decoded = decodeBase64(base64);

  if (!decoded.includes(":")) {
    return false;
  }

  const separatorIndex = decoded.indexOf(":");
  const user = decoded.slice(0, separatorIndex);
  const pass = decoded.slice(separatorIndex + 1);

  return user === expectedUser && pass === expectedPass;
}

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isProtectedAdminPath(pathname) || isProtectedAdminApiPath(pathname)) {
    if (!isAuthorized(req)) {
      return unauthorizedResponse();
    }

    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/api/admin/:path*"],
};
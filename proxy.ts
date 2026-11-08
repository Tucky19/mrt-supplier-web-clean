import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { isAdminAuthorized } from "@/lib/admin/basicAuth";

const intlMiddleware = createMiddleware(routing);

const legacyRedirects = new Map([
  ["/index.html", "/th"],
  ["/en/index.html", "/en"],
  ["/catalog", "/th/products"],
  ["/products", "/th/products"],
  ["/products/", "/th/products"],
  ["/products.html", "/th/products"],
  ["/contact", "/th/contact"],
  ["/brands.html", "/th/brands"],
]);

const temporaryLegacyRedirects = new Map([
  ["/store-locator", "/th/contact"],
  ["/store-locator/", "/th/contact"],
]);

function legacyRedirectResponse(req: NextRequest, destination: string) {
  const url = new URL(destination, req.url);

  return new Response(null, {
    status: 301,
    headers: {
      Location: url.toString(),
    },
  });
}

function temporaryLegacyRedirectResponse(req: NextRequest, destination: string) {
  const url = new URL(destination, req.url);

  return NextResponse.redirect(url, 307);
}

function unauthorizedResponse() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Area"',
      "Cache-Control": "private, no-store",
    },
  });
}

function isProtectedAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isLocalizedAdminPath(pathname: string) {
  return routing.locales.some(
    (locale) => pathname === `/${locale}/admin` || pathname.startsWith(`/${locale}/admin/`)
  );
}

function isProtectedAdminApiPath(pathname: string) {
  return pathname === "/api/admin" || pathname.startsWith("/api/admin/");
}

function isApiPath(pathname: string) {
  return pathname.startsWith("/api/");
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const legacyDestination = legacyRedirects.get(pathname);
  const temporaryLegacyDestination = temporaryLegacyRedirects.get(pathname);

  if (temporaryLegacyDestination) {
    return temporaryLegacyRedirectResponse(req, temporaryLegacyDestination);
  }

  if (legacyDestination) {
    return legacyRedirectResponse(req, legacyDestination);
  }

  const localizedAdmin = isLocalizedAdminPath(pathname);
  if (localizedAdmin || isProtectedAdminPath(pathname) || isProtectedAdminApiPath(pathname)) {
    if (!isAdminAuthorized(req.headers.get("authorization"))) {
      return unauthorizedResponse();
    }

    return localizedAdmin ? intlMiddleware(req) : NextResponse.next();
  }

  if (isApiPath(pathname)) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*).*)",
    // Catalog part numbers can contain dots; they still need locale resolution.
    "/th/products/:path*",
    "/en/products/:path*",
    "/admin/:path*",
    "/th/admin/:path*",
    "/en/admin/:path*",
    "/api/admin/:path*",
    "/index.html",
    "/en/index.html",
    "/products.html",
    "/brands.html",
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (pathname === "/") {
    return NextResponse.redirect(new URL(token ? "/feed" : "/login", request.url));
  }

  if (!token && pathname.startsWith("/feed")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/feed/:path*", "/login", "/register"],
};

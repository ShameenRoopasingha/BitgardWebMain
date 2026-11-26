import { NextResponse, type NextRequest } from "next/server";
import { CMS_SESSION_COOKIE, verifyCmsSessionToken } from "./lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(CMS_SESSION_COOKIE)?.value;
  const session = await verifyCmsSessionToken(token);

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/licenses/:path*", "/api/upload"],
};

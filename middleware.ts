import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export const config = {
  matcher: ["/admin/:path*"],
};

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const session = await auth();

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const role = session.user?.role;
  if (role !== "admin") {
    return NextResponse.redirect(new URL("/?error=unauthorized", request.url));
  }

  return NextResponse.next();
}

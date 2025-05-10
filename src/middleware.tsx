import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (['/login', '/waiting/verify', '/waiting/status', '/favicon.ico'].includes(pathname)) {
    return NextResponse.next();
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/cookiesProfile`, {
      headers: {
        cookie: request.headers.get("cookie") || "", // reenviamos cookies manualmente
      },
      credentials: "include",
    });

    if (!response.ok) throw new Error("Not authenticated");

    const data = await response.json();

    if (!data.isVerified) {
      return NextResponse.redirect(new URL('/waiting/verify', request.url));
    }

    if (!data.status) {
      return NextResponse.redirect(new URL('/waiting/status', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/', '/add', '/settings'],
};

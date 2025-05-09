import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = [
  '/login',
  '/waiting/verify',
  '/waiting/status',
  '/favicon.ico',
];

export async function middleware(request: NextRequest) {
  console.log("Middleware running for:", request.nextUrl.pathname);

  const { pathname } = request.nextUrl;

  if (publicRoutes.some(route => pathname.startsWith(route))) {
    console.log("Public route allowed:", pathname);
    return NextResponse.next();
  }

  const jwt = request.cookies.get("user")?.value;

  if (!jwt) {
    console.log("No JWT found, redirecting to login");
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(
      jwt,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    console.log("JWT payload:", payload);

    if (!payload.isVerified) {
      return NextResponse.redirect(new URL('/waiting/verify', request.url));
    }

    if (payload.status !== true) {
      return NextResponse.redirect(new URL('/waiting/status', request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
//   matcher: ['/', '/add', '/settings'],
    matcher: []
};

// para hacer todas las rutas adentro de una ruta es '/carpeta/:path*' eso significa q todas las rutas anidadas de esa carpeta estan protegidas por el middleware`
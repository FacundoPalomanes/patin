import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    console.log('pathname: ',pathname)

    if(['/login', '/waiting/verify', '/waiting/status', '/favicon.ico'].includes(pathname)) NextResponse.next();

    const jwt = request.cookies.get("user")?.value;
    if (!jwt) {
      console.log("No JWT found, redirecting to login");
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { payload } = await jwtVerify(jwt, new TextEncoder().encode(process.env.JWT_SECRET));
    if (!payload) {
      console.log("There was an error doing payload");
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (!payload.isVerified) return NextResponse.redirect(new URL('/waiting/verify', request.url));
    if (payload.status) return NextResponse.redirect(new URL('/waiting/status', request.url));

    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
    matcher: ['/', '/add', '/settings']
};

// para hacer todas las rutas adentro de una ruta es '/carpeta/:path*' eso significa q todas las rutas anidadas de esa carpeta estan protegidas por el middleware`
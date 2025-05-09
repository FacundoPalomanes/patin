import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
const protectedRoutes = ['/', '/add', '/settings'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si la ruta NO es protegida → dejar pasar
  if (!protectedRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const jwt = request.cookies.get("user")?.value;

  // Si no hay JWT → redirigir a login
  if (!jwt) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(
      jwt,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    // Si no está verificado → redirigir a waiting/verify
    if (!payload.isVerified) {
      return NextResponse.redirect(new URL('/waiting/verify', request.url));
    }

    // Si el status no es true → redirigir a waiting/status
    if (!payload.status) {
      return NextResponse.redirect(new URL('/waiting/status', request.url));
    }

    // Si todo bien → dejar pasar
    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}


export const config = {
  matcher: ['/', '/add', '/settings'],
};

// para hacer todas las rutas adentro de una ruta es '/carpeta/:path*' eso significa q todas las rutas anidadas de esa carpeta estan protegidas por el middleware`
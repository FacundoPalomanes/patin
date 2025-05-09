import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Rutas públicas que no necesitan autenticación
const publicRoutes = [
  '/login',
  '/waiting/verify',
  '/waiting/status',
  '/favicon.ico', // opcional: evitar errores con favicon
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acceso si es una ruta pública
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const jwt = request.cookies.get("user")?.value;

  if (!jwt) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(
      jwt,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    if (!payload.isVerified) {
      return NextResponse.redirect(new URL('/waiting/verify', request.url));
    }

    if (!payload.status) {
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
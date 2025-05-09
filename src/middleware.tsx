import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
    const jwt = request.cookies.get('user')?.value

    if (!jwt) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
        const { payload } = await jwtVerify(
            jwt,
            new TextEncoder().encode(process.env.JWT_SECRET)
        )

        if (payload.isVerified === false) {
            return NextResponse.redirect(new URL('/waiting/verify', request.url))
        }

        if (payload.status === false) {
            return NextResponse.redirect(new URL('/waiting/status', request.url))
        }

        return NextResponse.next()
    } catch (err) {
        console.error('JWT verification failed:', err)
        return NextResponse.redirect(new URL('/login', request.url))
    }
}
export const config = {
  matcher: [
    '/',           // protege raíz
    '/settings',   // protege settings
    '/add',        // protege add
  ],
};

// para hacer todas las rutas adentro de una ruta es '/carpeta/:path*' eso significa q todas las rutas anidadas de esa carpeta estan protegidas por el middleware`
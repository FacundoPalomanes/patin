import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {

    const jwtCookie = request.cookies.get("user");
    const jwt = jwtCookie?.value; // <-- extraer valor del cookie

    if (jwt === undefined) return NextResponse.redirect(new URL('/login', request.url));
    try {
        const { payload } = await jwtVerify(jwt, new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_DECODING));
        if (payload.isVerified === false) return NextResponse.redirect(new URL('/waiting/verify', request.url)); /// HERE SHOULD BE THE NEW URL OF WAITING VERIFY VIEW
        if(payload.status === false) return NextResponse.redirect(new URL('/waiting/status', request.url)) /// Here should go to anyone is not verified from us
    } catch (error) {
        console.log(error)
        return NextResponse.redirect(new URL('/login', request.url));
    }
    console.log(request.nextUrl)
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/settings', '/add']
}

// para hacer todas las rutas adentro de una ruta es '/carpeta/:path*' eso significa q todas las rutas anidadas de esa carpeta estan protegidas por el middleware`
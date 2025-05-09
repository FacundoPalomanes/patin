import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {

    const jwtCookie = request.cookies.get("user");
    const jwt = jwtCookie?.value; // <-- extraer valor del cookie

    if (jwt === undefined) return NextResponse.redirect(new URL('/login', request.url));
    try {
        const { payload } = await jwtVerify(jwt, new TextEncoder().encode("19aeb767eda2131432146004ce0ae6f13d47a507fe946d17d24884604beb693a11acbc993be2121718966fb95b09f1c080b192014d9ec74ad483fdae497f8891e77eb7dfa80c1dda85348867b0026567b9651b7b26930baec3c01020d15dbdda7393d42a9974e582a5b20bbe651251939626213cd31b25726b64f66a692d54c2d15a3375f50464ad303226cd8845463caface1c7d97dd418ffb1bed9632d697cdd2d2c39751678e013475823cdef25f73b40240710bb08fef384d50611dd59010f1425cd6d1fba541b14ed5b4f2f5f0450e0aab17f5dd96740170b2dd8ffd1b38e822c1cfd5e7e3e5084056ee19c35ee5d4c2b899317f94a5eff9d105149188a"));
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
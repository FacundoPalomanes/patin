import { NextRequest, NextResponse } from "next/server";

export function urlMiddleware(req: NextRequest): NextResponse | null {
  const origin = req.headers.get("origin") || req.headers.get("referer");
  const allowedOrigin = process.env.allowed_url;

  // Extrae solo el dominio base del referer si es necesario
  const baseOrigin = origin ? new URL(origin).origin : null;

  if (!baseOrigin || baseOrigin !== allowedOrigin) {
    return NextResponse.json(
      { message: "CORS: Origen no permitido" },
      { status: 403 }
    );
  }

  return null; // si está permitido, retorna null
}

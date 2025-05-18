import { NextRequest, NextResponse } from "next/server";
import { requestEmailChange } from "../../../../../libs/firebase/user/user";
import { urlMiddleware } from "../../../../../libs/urlMiddleware";

export async function POST(req: NextRequest) {
  try {
    urlMiddleware(req);
    const { email, newEmail, password } = await req.json();

    await requestEmailChange(email, newEmail, password);

    return NextResponse.json({
      message: "Se envió un correo de verificación al nuevo email.",
    }, { status: 200 });
  } catch (error) {
    console.error("Error al solicitar cambio de email:", error);
    return NextResponse.json({ error: "No se pudo iniciar el cambio de email." }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { updateUserPassword } from "../../../../../libs/firebase/user/user";
import { urlMiddleware } from "../../../../../libs/urlMiddleware";

export async function POST(req: NextRequest) {
  try {
    urlMiddleware(req);
    const { actualPassword, newPassword, email } = await req.json();

    await updateUserPassword(email, newPassword, actualPassword);

    return NextResponse.json({ message: "Contraseña actualizada con éxito." }, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar contraseña:", error);
    return NextResponse.json({ error: "Error actualizando la contraseña" }, { status: 500 });
  }
}

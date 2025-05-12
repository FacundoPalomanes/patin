import { NextRequest, NextResponse } from "next/server";
import { getPotentialUsers } from "../../../../../libs/firebase/admin/admin";
import { verifyToken } from "../../../../../libs/JWTVerify";

export async function GET(req: NextRequest) {
  try {
    // Verificar token pasando el objeto Request completo
    const decoded = verifyToken(req);

    if (!decoded) {
      return NextResponse.json(
        { message: "Token no proporcionado o inválido" },
        { status: 401 }
      );
    }

    // Obtener usuarios
    const users = await getPotentialUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Hubo un error trayendo los usuarios: ", error);
    return NextResponse.json(
      { message: "Hubo un error trayendo los usuarios" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { acceptUser } from "../../../../../libs/firebase/admin/admin";
import { urlMiddleware } from "../../../../../libs/urlMiddleware";

interface CustomJwtPayload extends jwt.JwtPayload {
  id: string;
}

export async function POST(req: NextRequest) {
  // Verificar el origen manualmente
  urlMiddleware(req);

  try {
    const { userId, category } = await req.json();
    const token = req.cookies.get("user")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Token no proporcionado" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.jwt_decoding as string
    ) as CustomJwtPayload;
    await acceptUser(decoded.id, userId, category);

    return NextResponse.json(
      { message: "Usuario aceptado con éxito" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Hubo un error aceptando el usuario: ", error);
    return NextResponse.json(
      { message: "Hubo un error aceptando el usuario" },
      { status: 500 }
    );
  }
}

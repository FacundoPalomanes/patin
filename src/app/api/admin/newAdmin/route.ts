import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { setNewAdmin } from "../../../../../libs/firebase/admin/admin";

// Definir una interfaz que extiende JwtPayload
interface CustomJwtPayload extends jwt.JwtPayload {
  id: string;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    const token = req.cookies.get("user")?.value;

    if (!token)
      return NextResponse.json(
        { message: "Token no proporcionado" },
        { status: 401 }
      );

    // Usar una declaración de tipo para asegurarte de que 'decoded' tiene la propiedad 'id'
    const decoded = jwt.verify(
      token,
      process.env.jwt_decoding as string
    ) as CustomJwtPayload;

    // Ahora TypeScript sabe que 'decoded' tiene un 'id'
    await setNewAdmin(decoded.id, userId);

    return NextResponse.json(
      { message: "Admin creado con exito" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Hubo un error intentando hacer admin al usuario: ", error);
    return NextResponse.json(
      { message: "Hubo un error intentando hacer administrador al usuario" },
      { status: 500 }
    );
  }
}

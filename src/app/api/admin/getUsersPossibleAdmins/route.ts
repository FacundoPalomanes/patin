import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getUsersPossibleAdmins } from "../../../../../libs/firebase/admin/admin";
import { urlMiddleware } from "../../../../../libs/urlMiddleware";

interface CustomJwtPayload extends jwt.JwtPayload {
  id: string;
}

export async function GET(req: NextRequest) {
  try {
    urlMiddleware(req);
    const token = req.cookies.get("user")?.value;

    if (!token)
      return NextResponse.json(
        { message: "Token no proporcionado" },
        { status: 401 }
      );

    const decoded = jwt.verify(
      token,
      process.env.jwt_decoding as string
    ) as CustomJwtPayload;

    const users = await getUsersPossibleAdmins(decoded.id);

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error(
      "Hubo un error trayendo los usuarios para administrador: ",
      error
    );
    return NextResponse.json(
      { message: "Hubo un error trayendo los usuarios para administrador" },
      { status: 500 }
    );
  }
}

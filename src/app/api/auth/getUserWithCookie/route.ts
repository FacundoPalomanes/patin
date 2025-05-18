import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { logInGetUserDB } from "../../../../../libs/firebase/auth/auth";
import serializeCookie from "../../../../../libs/serializeCookies";
import { NextRequest } from "next/server";
import { urlMiddleware } from "../../../../../libs/urlMiddleware";

interface MyJwtPayload extends JwtPayload {
  id: string;
  isVerified: boolean;
  status: string;
}

export async function GET(req: NextRequest) {
  try {
    urlMiddleware(req);
    const token = (await cookies()).get("user")?.value;
    if (!token) {
      return Response.json(
        { message: "Token no proporcionado" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.jwt_decoding!
    ) as MyJwtPayload;

    const userDocs = await logInGetUserDB(decoded.id);
    if (!userDocs) {
      return Response.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const serialized = await serializeCookie(
      decoded.id,
      true,
      userDocs.isFinalUser
    );

    const response = Response.json({
      verified: true,
      user: userDocs,
      status: userDocs.isFinalUser,
    });

    response.headers.set("Set-Cookie", serialized);
    return response;
  } catch (error) {
    console.error("Error verificando usuario:", error);
    return Response.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

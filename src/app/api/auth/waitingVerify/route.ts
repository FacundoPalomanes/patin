import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { verifyEmail, logInGetUserDB } from "../../../../../libs/firebase/auth/auth";
import serializeCookie from "../../../../../libs/serializeCookies";

export async function GET() {
  try {
    const token = (await cookies()).get("user")?.value;
    if (!token) {
      return new Response(JSON.stringify({ message: "Token no proporcionado" }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.jwt_decoding!);
    if (typeof decoded !== "object" || !("id" in decoded)) {
      return new Response(JSON.stringify({ message: "Token inválido" }), { status: 401 });
    }

    const id = (decoded as jwt.JwtPayload).id;
    const status = await verifyEmail(id);

    if (status) {
      const userDocs = await logInGetUserDB(id);
      if (!userDocs) {
        return new Response(JSON.stringify({ message: "Usuario no encontrado" }), { status: 404 });
      }

      const serialized = await serializeCookie(id, true, userDocs.isFinalUser);
      const response = new Response(
        JSON.stringify({ verified: true, user: userDocs, status: userDocs.isFinalUser })
      );
      response.headers.set("Set-Cookie", serialized);
      return response;
    }

    return Response.json({ verified: false });
  } catch (error) {
    console.error("Error verificando usuario:", error);
    return Response.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

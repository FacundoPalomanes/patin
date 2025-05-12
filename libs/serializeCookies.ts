import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function serializeCookie(uid: string, isVerified: boolean, status: boolean) {
  try {

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined in environment variables");
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
        id: uid,
        isVerified: isVerified,
        status: status,
      },
      secret
    );
    const serialized = serialize("user", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
    });

    return serialized;
  } catch (error) {
    console.error("Hubo un error creando la cookie: ", error);
    throw error;
  }
}

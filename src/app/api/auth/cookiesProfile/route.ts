import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest } from "next/server";
import { urlMiddleware } from "../../../../../libs/urlMiddleware";

export async function GET(req: NextRequest) {
  urlMiddleware(req);

  const userCookies = (await cookies()).get("user")?.value;
  if (!userCookies) {
    return Response.json({ error: "no token" }, { status: 401 });
  }

  try {
    const user = jwt.verify(userCookies, process.env.jwt_decoding!);

    if (typeof user !== "object" || user === null) {
      return Response.json(
        { error: "Invalid Token structure" },
        { status: 401 }
      );
    }

    const payload = user as JwtPayload;

    return Response.json({
      token: userCookies,
      id: payload.id,
      isVerified: payload.isVerified,
      status: payload.status,
    });
  } catch (error: unknown) {
    console.error("Error obteniendo el usuario:", error);
    return Response.json({ error: "Invalid Token" }, { status: 401 });
  }
}

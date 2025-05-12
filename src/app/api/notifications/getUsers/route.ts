import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getUsers } from "../../../../../libs/firebase/notifications/notifications";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("user")?.value;
    if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.jwt_decoding as string) as { id: string };
    const users = await getUsers(decoded.id);
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Hubo un error obteniendo los usuarios: ", error);
    return NextResponse.json({ message: "Hubo un error obteniendo los usuarios" }, { status: 500 });
  }
}

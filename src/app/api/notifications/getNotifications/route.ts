import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getNotifications } from "../../../../../libs/firebase/notifications/notifications";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("user")?.value;
    if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.jwt_decoding as string) as { id: string };
    const notifications = await getNotifications(decoded.id);

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error("Hubo un error obteniendo las notificaciones:", error);
    return NextResponse.json({ message: "Hubo un error enviando la notificación" }, { status: 500 });
  }
}

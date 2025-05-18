import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { postNotification } from "../../../../../libs/firebase/notifications/notifications";
import { urlMiddleware } from "../../../../../libs/urlMiddleware";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    urlMiddleware(req);
    const token = req.cookies.get("user")?.value;
    if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

    const formData = await req.formData();
    const description = formData.get("description") as string;
    const receiverId = formData.get("receiverId") as string;

    if (!description || description.trim() === "") {
      return NextResponse.json({ message: "La descripción es obligatoria" }, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.jwt_decoding as string) as { id: string };

    await postNotification(description, receiverId, decoded.id);

    return NextResponse.json({ message: "Notificación enviada con éxito" }, { status: 200 });
  } catch (error) {
    console.error("Hubo un error añadiendo una notificación:", error);
    return NextResponse.json({ message: "Hubo un error enviando la notificación" }, { status: 500 });
  }
}

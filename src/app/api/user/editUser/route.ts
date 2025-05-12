import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { uploadUser } from "../../../../../libs/firebase/user/user";
import { updatePhoto } from "../../../../../libs/cloudinary/cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface DecodedToken {
  id: string;
  iat?: number;
  exp?: number;
}

interface FileLike {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("user")?.value;
    if (!token)
      return NextResponse.json({ error: "No token" }, { status: 401 });

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(
        token,
        process.env.jwt_decoding as string
      ) as DecodedToken;
    } catch {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 401 }
      );
    }

    const uid = decoded.id;
    if (!uid)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const formData = await req.formData();

    const nombre = formData.get("nombre")?.toString();
    const apellido = formData.get("apellido")?.toString();
    const categoria = formData.get("categoria")?.toString();
    const dni = formData.get("dni")?.toString();
    const telefono = formData.get("telefono")?.toString();
    const foto = formData.get("foto") as File | null;

    const updates: Record<string, string> = {};
    if (nombre) updates.name = nombre;
    if (apellido) updates.surname = apellido;
    if (dni) updates.dni = dni;
    if (telefono) updates.phoneNumber = telefono;
    if (categoria !== null && categoria !== undefined)
      updates.categoria = categoria;

    console.log("Categoria: ", typeof categoria);

    const isOnlyCategoriaVacia =
      Object.keys(updates).length === 1 && updates.categoria === "";
    const hasValidUpdates = Object.entries(updates).some(
      ([key, val]) => val !== undefined && (val !== "" || key === "categoria")
    );

    if (!hasValidUpdates && !isOnlyCategoriaVacia && !foto) {
      return NextResponse.json(
        { message: "No hay cambios para actualizar." },
        { status: 400 }
      );
    }

    if (foto && foto.size > 0) {
      const buffer = Buffer.from(await foto.arrayBuffer());

      const fileLike: FileLike = {
        fieldname: "foto",
        originalname: foto.name,
        encoding: "7bit", // valor por defecto similar a multer
        mimetype: foto.type,
        buffer,
        size: buffer.length,
      };

      await updatePhoto(fileLike, uid);
    }

    await uploadUser(updates, uid);

    return NextResponse.json(
      { message: "Perfil actualizado con éxito.", updates },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return NextResponse.json(
      { error: "Error actualizando el perfil", errorObject: error },
      { status: 500 }
    );
  }
}

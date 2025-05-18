import { NextRequest, NextResponse } from "next/server";
import { uploadPostsPhotos } from "../../../../../libs/cloudinary/cloudinary";
import { uploadNewPost } from "../../../../../libs/firebase/posts/posts";
import jwt from "jsonwebtoken";
import { urlMiddleware } from "../../../../../libs/urlMiddleware";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    urlMiddleware(req)
    const token = req.cookies.get("user")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.jwt_decoding as string) as { id: string };

    const formData = await req.formData();
    const description = formData.get("description") as string;

    if (!description) {
      return NextResponse.json({ message: "Faltan datos para crear el post." }, { status: 400 });
    }

    const files = formData.getAll("images");

    const imageFiles: { buffer: Buffer; originalFilename: string }[] = [];

    for (const file of files) {
      if (file instanceof Blob) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        imageFiles.push({
          buffer,
          originalFilename: (file as File).name,
        });
      }
    }

    const imageUrls = imageFiles.length > 0 ? await uploadPostsPhotos(imageFiles) : [];

    await uploadNewPost(decoded.id, description, imageUrls);

    return NextResponse.json({ message: "Post creado con éxito" }, { status: 201 });

  } catch (error) {
    console.error("Error al publicar un nuevo post:", error);
    return NextResponse.json({ message: "No se pudo crear el post" }, { status: 500 });
  }
}

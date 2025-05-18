import { NextRequest, NextResponse } from "next/server";
import { getAllPostsOrdered } from "../../../../../libs/firebase/posts/posts";
import { verifyToken } from "../../../../../libs/JWTVerify";
import { urlMiddleware } from "../../../../../libs/urlMiddleware";

export async function GET(req: NextRequest) {
  try {
    urlMiddleware(req)
    const isVerified = verifyToken(req);
    if (!isVerified) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await getAllPostsOrdered();
    return NextResponse.json(posts, { status: 200 });

  } catch (error) {
    console.error("Error intentando traer los posts:", error);
    return NextResponse.json(
      { message: "No se pudo traer los posts más recientes" },
      { status: 500 }
    );
  }
}

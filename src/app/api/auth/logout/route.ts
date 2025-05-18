import { serialize } from "cookie";
import { urlMiddleware } from "../../../../../libs/urlMiddleware";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  urlMiddleware(req);
  const serialized = serialize("user", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  const response = new Response(JSON.stringify({ message: "logout successfully" }), {
    status: 200,
  });
  response.headers.set("Set-Cookie", serialized);
  return response;
}

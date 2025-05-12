import { serialize } from "cookie";

export async function GET() {
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

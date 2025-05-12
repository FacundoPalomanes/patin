import { NextRequest, NextResponse } from "next/server";
import { logIn, logInGetUserDB } from "../../../../../libs/firebase/auth/auth";
import serializeCookie from "../../../../../libs/serializeCookies";

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const email = body.get("email")?.toString();
  const password = body.get("password")?.toString();

  if (!email || !password)
    return NextResponse.json({ error: "Please fill all fields" }, { status: 401 });

  try {
    const user = await logIn(email, password);
    const userDocs = await logInGetUserDB(user.uid);

    if(!userDocs) return NextResponse.json({ error: "User not found" }, { status: 401 });

    const serialized = await serializeCookie(
      user.uid,
      user.emailVerified,
      userDocs.isFinalUser
    );

    const response = NextResponse.json({
      message: "login Successfully",
      isVerified: user.emailVerified,
      user: userDocs,
      status: userDocs.isFinalUser,
    });

    response.headers.set("Set-Cookie", serialized);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json("Error intentando de hacer el logIn", { status: 400 });
  }
}

import { addUserToDB, addImageToDB } from "../../../../../libs/firebase/auth/auth";
import serializeCookie from "../../../../../libs/serializeCookies";
import { NextResponse } from "next/server";

interface RegisterFields {
  name: string;
  surname: string;
  email: string;
  password: string;
  phoneNumber: string;
  fechaNacimiento: string;
  dni: string;
  responsibleName?: string;
  responsiblePhone?: string;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const fields: RegisterFields = {
      name: formData.get("name") as string,
      surname: formData.get("surname") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      fechaNacimiento: formData.get("fechaNacimiento") as string,
      dni: formData.get("dni") as string,
      responsibleName: formData.get("responsibleName") as string,
      responsiblePhone: formData.get("responsiblePhone") as string,
    };

    const file = formData.get("uploadPhoto");

    if (
      !fields.name ||
      !fields.surname ||
      !fields.email ||
      !fields.password ||
      !fields.phoneNumber ||
      !fields.fechaNacimiento ||
      !fields.dni ||
      !(file instanceof Blob)
    ) {
      return NextResponse.json(
        { error: "Please fill all fields" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const user = await addUserToDB(
      fields.name,
      fields.surname,
      fields.email,
      fields.password,
      fields.phoneNumber,
      fields.fechaNacimiento,
      fields.dni,
      fields.responsibleName,
      fields.responsiblePhone
    );

    if (!user) {
      return NextResponse.json(
        { error: "Error creating user, user may already exist" },
        { status: 401 }
      );
    }

    await addImageToDB(
      {
        buffer,
        originalFilename: (file as File).name,
      },
      user
    );

    const serialized = await serializeCookie(
      user.uid,
      user.emailVerified,
      false
    );

    const response = NextResponse.json({ user }, { status: 200 });
    response.headers.set("Set-Cookie", serialized);
    return response;

  } catch (error) {
    console.error("Error creando usuario:", error);
    return NextResponse.json(
      { error: "Error creando el usuario" },
      { status: 500 }
    );
  }
}

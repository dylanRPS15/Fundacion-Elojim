export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/libs/db";

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // Buscar usuario con token válido
    const user = await db.users.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Token expirado, vuelve a solicitar el cambio de contraseña" }, { status: 400 });
    }

    // Hashear nueva contraseña
    const hashed = await bcrypt.hash(password, 10);

    await db.users.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

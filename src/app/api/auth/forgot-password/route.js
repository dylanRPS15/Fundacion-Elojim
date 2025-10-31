import { NextResponse } from "next/server";
import crypto from "crypto";
import db from "@/libs/db";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Correo requerido" }, { status: 400 });
    }

    // Verificar que el correo exista
    const user = await db.users.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "No existe una cuenta con este correo" }, { status: 404 });
    }

    // Generar token aleatorio y fecha de expiración (10 minutos)
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await db.users.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpires: expires,
      },
    });

    // Crear transporte de nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${token}`;

    // ✉️ Correo HTML profesional
    const htmlContent = `
      <div style="font-family:'Segoe UI',Arial,sans-serif;background:#f9fafc;padding:30px">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.08);overflow:hidden">
          <div style="background:#1B3C8C;padding:20px;text-align:center">
            <img src="https://elojimjadach.org/logo2.webp" alt="Fundación Elojim Jadach" width="70" style="border-radius:50%;margin-bottom:10px">
            <h2 style="color:white;margin:0;font-size:22px">Recuperar Contraseña</h2>
          </div>
          <div style="padding:30px">
            <p style="font-size:16px;color:#333">Hola <strong>${user.name}</strong>,</p>
            <p style="font-size:15px;color:#555">
              Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para continuar:
            </p>
            <div style="text-align:center;margin:25px 0">
              <a href="${resetLink}" style="background:#1B3C8C;color:white;padding:12px 25px;border-radius:8px;text-decoration:none;font-weight:bold">
                Restablecer Contraseña
              </a>
            </div>
            <p style="font-size:14px;color:#666">
              Este enlace expirará en <strong>10 minutos</strong>. Si no solicitaste el cambio, puedes ignorar este correo.
            </p>
          </div>
          <div style="background:#f1f4f9;text-align:center;padding:12px;color:#777;font-size:13px">
            © ${new Date().getFullYear()} Fundación Elojim Jadach. Todos los derechos reservados.
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Fundación Elojim Jadach" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔒 Restablece tu contraseña - Fundación Elojim Jadach",
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error al enviar correo:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

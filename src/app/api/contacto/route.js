export const dynamic = 'force-dynamic'
export const revalidate = 0

import nodemailer from "nodemailer";

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

console.log("ENV loaded:", process.env.EMAIL_USER);

export async function POST(req) {
  try {
    const { nombre, email, asunto, mensaje } = await req.json();

    if (!nombre || !email || !asunto || !mensaje) {
      return new Response(JSON.stringify({ error: "Faltan campos obligatorios" }), {
        status: 400,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Email inválido" }), { status: 400 });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false, // ⚠️ permite certificados autofirmados (solo para desarrollo)
        },
    });

    await transporter.sendMail({
      from: `"Formulario Web" <${process.env.EMAIL_USER}>`,
      to: "dylan34b2@gmail.com", // aquí llega el mensaje
      subject: `📬 Nuevo mensaje: ${asunto}`,
      html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f7fa; padding: 40px;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.08); overflow: hidden;">
              
              <div style="background-color: #1B3C8C; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 22px;">📩 Nuevo mensaje de contacto</h1>
              </div>

              <div style="padding: 30px;">
                <p style="font-size: 16px; color: #333;">Has recibido un nuevo mensaje desde el formulario de contacto de <strong>Fundación Elojim Jadach</strong>.</p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

                <p style="margin-bottom: 10px;"><strong>👤 Nombre:</strong> ${escapeHTML(nombre)}</p>
                <p style="margin-bottom: 10px;"><strong>📧 Email:</strong> <a href="mailto:${escapeHTML(email)}" style="color: #1B3C8C;">${escapeHTML(email)}</a></p>
                <p style="margin-bottom: 10px;"><strong>📝 Asunto:</strong> ${escapeHTML(asunto)}</p>
                <p style="margin-top: 20px;"><strong>💬 Mensaje:</strong></p>
                <div style="background-color: #f9fafc; border-left: 4px solid #1B3C8C; padding: 15px; margin-top: 10px; border-radius: 5px; color: #333; line-height: 1.6;">
                  ${escapeHTML(mensaje).replace(/\n/g, "<br/>")}
                </div>

                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

                <p style="font-size: 13px; color: #777; text-align: center;">
                  Este mensaje fue generado automáticamente por el sitio web de la 
                  <strong>Fundación Elojim Jadach</strong>.<br/>
                  Por favor no respondas directamente a este correo.
                </p>
              </div>

              <div style="background-color: #f1f4f9; text-align: center; padding: 15px;">
                <p style="font-size: 13px; color: #555; margin: 0;">© ${new Date().getFullYear()} Fundación Elojim Jadach. Todos los derechos reservados.</p>
              </div>
            </div>
          </div>
        `,

    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error al enviar el correo:", error.message, error.stack);
    return new Response(JSON.stringify({ error: "Error al enviar el mensaje" }), {
      status: 500,
    });
  }
}

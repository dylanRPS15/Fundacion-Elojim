import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { EstratoSocial, GrupoEtnico, TipoDocumento } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { sendRegistroUpdate } from "../stream/route"; // 🔹 Importa el emisor SSE
import { sendEventoUpdate } from "@/app/api/inscripciones-evento/stream/route";

const CAMPOS_OBLIGATORIOS = [
  "nombreResponsable", // Ahora se espera este nombre
  "tipoDocumento",
  "numeroDocumento",
  "fechaNacimiento",
  "telefono",          // Ahora se espera este nombre
  "direccion",
  "barrio",            // Ahora se espera este nombre
  "comuna",
  "estratoSocial",
  "grupoEtnico",
  "motivacion",
  "tiempoSemanal",
  "expectativas",
  "aceptaTerminos"
];

const ESTRATOS = Object.values(EstratoSocial);
const GRUPOS_ETNICOS = Object.values(GrupoEtnico);
const TIPOS_DOCUMENTO = Object.values(TipoDocumento);

function validarDatos(data) {
  for (const campo of CAMPOS_OBLIGATORIOS) {
    if (data[campo] === undefined || data[campo] === null || data[campo] === "") {
      throw new Error(`El campo '${campo}' es obligatorio.`);
    }
  }

  if (!/^\d{8,10}$/.test(data.numeroDocumento)) {
    throw new Error("El número de documento debe tener entre 8 y 10 dígitos.");
  }

  const telefonoLimpio = String(data.telefono || '').replace(/\D/g, ''); // Usa data.telefono
  if (!/^\d{10}$/.test(telefonoLimpio)) {
    throw new Error("El teléfono debe tener 10 dígitos.");
  }

  if (!data.barrio) {
      throw new Error("El barrio es obligatorio.");
  }

  if (data.correoElectronico && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correoElectronico)) {
    throw new Error("El correo electrónico tiene un formato inválido.");
  }

  if (!TIPOS_DOCUMENTO.includes(data.tipoDocumento)) {
    throw new Error("El tipo de documento no es válido.");
  }

  if (!ESTRATOS.includes(data.estratoSocial)) {
    throw new Error("El estrato social no es válido.");
  }

  if (!GRUPOS_ETNICOS.includes(data.grupoEtnico)) {
    throw new Error("El grupo étnico no es válido.");
  }

  if (data.tieneTierras && (data.hectareas === null || data.pisoTermico === "")) {
    throw new Error("Debe especificar hectáreas y piso térmico si tiene tierras.");
  }

  if (data.tieneCultivo && !data.tiposCultivo) {
    throw new Error("Debe especificar los tipos de cultivo si tiene cultivo.");
  }

  if (data.tieneHerramientas && !data.tiposHerramientas) {
    throw new Error("Debe especificar los tipos de herramientas si tiene herramientas.");
  }

  if (data.participacionPrevia && !data.proyectosAnteriores) {
    throw new Error("Debe especificar los proyectos anteriores si hubo participación previa.");
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    if (!userId) {
      return NextResponse.json({ error: "Usuario no autenticado" }, { status: 401 });
    }

    const data = await request.json();
    validarDatos(data);

    const nuevoRegistro = await prisma.registroSeguridadAlimentaria.create({
      data: {
        ...data,
        fechaNacimiento: new Date(data.fechaNacimiento),
        usuario: {
          connect: { id: userId },
        },
      },
    });

    sendRegistroUpdate({
      action: "created",
      programId: "seguridad-alimentaria",
      userId: userId,
    });

    return NextResponse.json(nuevoRegistro, { status: 201 });
  } catch (error) {
    console.error("Error al registrar seguridad alimentaria:", error);
    return NextResponse.json(
      {
        error: error.message || "Error interno del servidor",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const registros = await prisma.registroSeguridadAlimentaria.findMany({
      orderBy: { id: "desc" },
    });

    return new Response(JSON.stringify(registros), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error al obtener registros:", error);
    return new Response("Error al obtener registros", { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const { id } = await req.json();

    const registro = await prisma.registroSeguridadAlimentaria.findUnique({
      where: { id },
    });

    if (!registro) {
      return new Response("Registro no encontrado", { status: 404 });
    }

    // 🔹 Obtener las inscripciones que se van a eliminar (para actualizar contadores)
    const inscripciones = await prisma.inscripcionPorEvento.findMany({
      where: {
        programId: "seguridad-alimentaria",
        userId: registro.userId,
      },
      select: { id: true, eventoId: true },
    });

    await prisma.$transaction([
      prisma.inscripcionPorEvento.deleteMany({
        where: { programId: "seguridad-alimentaria", userId: registro.userId },
      }),
      prisma.registroSeguridadAlimentaria.delete({ where: { id } }),
       // 🔹 Decrementar contador "registered" en cada evento afectado
      ...inscripciones.map((i) =>
        prisma.evento.update({
          where: { id: i.eventoId },
          data: { registered: { decrement: 1 } },
        })
      ),
    ]);

    sendRegistroUpdate({
      action: "deleted",
      programId: "seguridad-alimentaria",
      userId: registro.userId,
    });

    for (const insc of inscripciones) {
      sendEventoUpdate({
        action: "deleted",
        eventoId: insc.eventoId,
        programId: "seguridad-alimentaria",
        inscripcionId: insc.id,
        userId: registro.userId,
      });
    }

    return new Response("Registro eliminado exitosamente", { status: 200 });
  } catch (error) {
    console.error("❌ Error al eliminar registro:", error);
    return new Response("Error interno al eliminar registro", { status: 500 });
  }
}



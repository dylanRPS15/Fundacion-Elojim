import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { EstratoSocial, GrupoEtnico } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth";
import { sendRegistroUpdate } from "../stream/route"; // 🔹 Importa el emisor SSE
import { sendEventoUpdate } from "@/app/api/inscripciones-evento/stream/route";

const ESTRATOS_VALIDOS = Object.values(EstratoSocial);
const GRUPOS_ETNICOS_VALIDOS = Object.values(GrupoEtnico);

const actividadesTecnologicas = [
  "Programación básica",
  "Robótica educativa",
  "Diseño de videojuegos",
  "Inteligencia Artificial para niños",
  "Ciencia y experimentos",
  "Otras"
];

const CAMPOS_OBLIGATORIOS = [
  "nombreCompleto",
  "fechaNacimiento",
  "comuna",
  "estratoSocial",
  "edad",
  "grupoEtnico",
  "institucionEducativa",
  "cursoGrado",
  "direccion",
  "nombreAcudiente",
  "relacionNino",
  "telefonoContacto",
  "disponibilidad",
  "motivacion",
  "expectativa",
  "aceptaTerminos"
];

function validarDatos(data) {
  for (const campo of CAMPOS_OBLIGATORIOS) {
    if (data[campo] === undefined || data[campo] === null || data[campo] === "") {
      throw new Error(`El campo '${campo}' es obligatorio.`);
    }
  }

  if (!/^\d{10}$/.test(data.telefonoContacto)) {
    throw new Error("El teléfono de contacto debe tener 10 dígitos.");
  }

  if (data.correoElectronico && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correoElectronico)) {
    throw new Error("El correo electrónico tiene un formato inválido.");
  }

  if (!ESTRATOS_VALIDOS.includes(data.estratoSocial)) {
    throw new Error("El estrato social no es válido.");
  }

  if (!GRUPOS_ETNICOS_VALIDOS.includes(data.grupoEtnico)) {
    throw new Error("El grupo étnico no es válido.");
  }

  // Validación de actividadesInteres
  if (!Array.isArray(data.actividadesInteres)) {
    throw new Error("El campo 'actividadesInteres' debe ser una lista.");
  }

  const actividadesInvalidas = data.actividadesInteres.filter(
    (actividad) => !actividadesTecnologicas.includes(actividad)
  );

  if (actividadesInvalidas.length > 0) {
    throw new Error(
      `Las siguientes actividades de interés no son válidas: ${actividadesInvalidas.join(", ")}`
    );
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

    const nuevoRegistro = await prisma.RegistroTallerSteam.create({
      data: {
        ...data,
        fechaNacimiento: new Date(data.fechaNacimiento),
        actividadesInteres: data.actividadesInteres || [],
        usuario: {
          connect: { id: userId },
        },
      },
    });

    sendRegistroUpdate({
      action: "created",
      programId: "taller-steam",
      userId: userId,
    });

    return NextResponse.json(nuevoRegistro, { status: 201 });
  } catch (error) {
    console.error("Error al registrar taller STEAM:", error);
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
    const registros = await prisma.RegistroTallerSteam.findMany({
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

    const registro = await prisma.RegistroTallerSteam.findUnique({
      where: { id },
    });

    if (!registro) {
      return new Response("Registro no encontrado", { status: 404 });
    }


    // 🔹 Obtener las inscripciones que se van a eliminar (para actualizar contadores)
    const inscripciones = await prisma.inscripcionPorEvento.findMany({
      where: {
        programId: "semillero-innovacion",
        userId: registro.userId,
      },
      select: { id: true, eventoId: true },
    });

    await prisma.$transaction([
      prisma.inscripcionPorEvento.deleteMany({
        where: { programId: "semillero-innovacion", userId: registro.userId },
      }),
      prisma.registroSemilleroInnovacion.delete({ where: { id } }),
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
      programId: "taller-steam",
      userId: registro.userId,
    });

    for (const insc of inscripciones) {
      sendEventoUpdate({
        action: "deleted",
        eventoId: insc.eventoId,
        programId: "taller-steam",
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
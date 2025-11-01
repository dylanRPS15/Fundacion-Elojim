export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // si usas next-auth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendEventoUpdate } from "../inscripciones-evento/stream/route"; // 🔹 Importa el emisor SSE

// Mapa de tablas por programa

const registroProgramasMap = {
  "mujer-vulnerable": {
    table: "registroMujerVulnerable",
    emailField: "correoElectronico",
    nombreField: "nombreCompleto",
    documentoField: "numeroDocumento",
  },
  "semillero-innovacion": {
    table: "registroSemilleroInnovacion",
    emailField: "correoElectronico",
    nombreField: "nombreCompleto",
    documentoField: "numeroDocumento",
  },
  "seguridad-alimentaria": {
    table: "registroSeguridadAlimentaria",
    emailField: "correoElectronico",
    nombreField: "nombreResponsable",
    documentoField: "numeroDocumento",
  },
  "cultural": {
    table: "registroCultural",
    emailField: "correoElectronico",
    nombreField: "nombreCompleto",
    documentoField: "documentoIdentidad",
  },
  "voluntariado": {
    table: "registroVoluntariado",
    emailField: "correoElectronico",
    nombreField: "nombreCompleto",
    documentoField: "numeroDocumento",
  },
  "economia-plateada": {
    table: "registroEconomiaPlateada",
    emailField: "correoElectronico",
    nombreField: "nombreCompleto",
    documentoField: "numeroDocumento",
  },
  "taller-steam": {
  table: "registroTallerSteam",
  emailField: "correoElectronico",
  nombreField: "nombreCompleto",
  documentoField: null,
},
  "refuerzo-escolar": {
    table: "registroRefuerzoEscolar",
    emailField: "correoElectronico",
    nombreField: "nombreCompleto",
    documentoField: null, // No definido
  },
  "software-factory": {
    table: "registroSoftwareFactory",
    emailField: "correoElectronico",
    nombreField: "nombreCompleto",
    documentoField: "numeroDocumento",
  },
};

async function getDatosDelRegistro(programId, userId) {
  const config = registroProgramasMap[programId];
  if (!config) throw new Error("Programa no reconocido");

  const registro = await prisma[config.table].findFirst({
    where: { userId },
  });

  if (!registro) throw new Error("Registro no encontrado para este usuario");

  const datos = {
    nombreCompleto: registro[config.nombreField],
  };

  if (config.documentoField) {
    datos.numeroDocumento = registro[config.documentoField];
  }

  return datos;
}

export async function POST(req) {
  try {
    const { programId, eventoId } = await req.json();

    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    if (!userId || !programId || !eventoId) {
      return NextResponse.json({ message: "Faltan datos" }, { status: 400 });
    }

    const programIdMap = {
      "mujer-vulnerable": "MUJER_VULNERABLE",
      "semillero-innovacion": "SEMILLERO_INNOVACION",
      "seguridad-alimentaria": "SEGURIDAD_ALIMENTARIA",
      "cultural": "CULTURAL",
      "voluntariado": "VOLUNTARIADO",
      "economia-plateada": "ECONOMIA_PLATEADA",
      "taller-steam": "TALLER_STEAM",
      "refuerzo-escolar": "REFUERZO_ESCOLAR",
      "software-factory": "SOFTWARE_FACTORY",
    };

    const evento = await prisma.evento.findUnique({ where: { id: eventoId } });
    if (!evento) {
      return NextResponse.json({ message: "Evento no encontrado" }, { status: 404 });
    }

    const expectedProgramId = programIdMap[programId];
    if (!expectedProgramId) {
      return NextResponse.json({ message: `Programa inválido: ${programId}` }, { status: 400 });
    }

    if (evento.programId !== expectedProgramId) {
      return NextResponse.json(
        { message: `El evento ${eventoId} no pertenece al programa ${programId}` },
        { status: 400 }
      );
    }

    const count = await prisma.inscripcionPorEvento.count({ where: { eventoId } });
    if (count >= evento.capacity) {
      return NextResponse.json({ message: "Cupo lleno" }, { status: 400 });
    }

    const { nombreCompleto, numeroDocumento } = await getDatosDelRegistro(programId, userId);

    const inscripcion = await prisma.inscripcionPorEvento.create({
      data: {
        userId,
        nombreCompleto,
        numeroDocumento,
        programId,
        eventoId,
      },
    });

    // 🔹 Actualizar el contador del evento
    await prisma.evento.update({
      where: { id: eventoId },
      data: { registered: { increment: 1 } },
    });

    // 🔹 Enviar el evento SSE con el ID de inscripción real
    sendEventoUpdate({
      action: "created",
      eventoId,
      programId,
      userId: session?.user?.id,
      inscripcionId: inscripcion.id, // ✅ agregar aquí
    });

    // 🔹 Responder con el ID correcto
    return NextResponse.json(
      { message: "Inscripción realizada con éxito", id: inscripcion.id },
      { status: 201 });
  } catch (err) {
    console.error("Error en inscripción:", err);
    return NextResponse.json({ message: err.message || "Error interno" }, { status: 500 });
  }
}


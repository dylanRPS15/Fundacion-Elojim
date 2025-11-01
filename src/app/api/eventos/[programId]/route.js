export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const programIdMap = {
  "mujer-vulnerable": "MUJER_VULNERABLE",
  "semillero-innovacion": "SEMILLERO_INNOVACION",
  "seguridad-alimentaria": "SEGURIDAD_ALIMENTARIA",
  "voluntariado": "VOLUNTARIADO",
  "economia-plateada": "ECONOMIA_PLATEADA",
  "cultural": "CULTURAL",
  "taller-steam": "TALLER_STEAM",
  "refuerzo-escolar": "REFUERZO_ESCOLAR",
  "software-factory": "SOFTWARE_FACTORY",
};

function validateProgramId(rawProgramId) {
  return programIdMap[rawProgramId] || null;
}

function validateEventoData(data) {
  const { title, description, date, location, duration, capacity } = data;

  if (
    !title?.trim() ||
    !description?.trim() ||
    !date ||
    !location?.trim() ||
    !duration?.trim() ||
    !capacity ||
    typeof capacity !== "number" ||
    capacity <= 0
  ) {
    return "Faltan datos obligatorios o datos inválidos.";
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return "Fecha inválida.";
  }

  if (location.length > 255 || duration.length > 100) {
    return "Los campos de ubicación o duración son demasiado largos.";
  }

  return null;
}

export async function GET(request, context) {
  try {
    const rawProgramId = context.params.programId;
    const programId = validateProgramId(rawProgramId);

    if (!programId) {
      return NextResponse.json({ message: `programId inválido: ${rawProgramId}` }, { status: 400 });
    }

    const eventos = await prisma.evento.findMany({
      where: { programId },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(eventos, { status: 200 });
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(request, context) {
  try {
    const rawProgramId = context.params.programId;
    const programId = validateProgramId(rawProgramId);

    if (!programId) {
      return NextResponse.json({ message: `programId inválido: ${rawProgramId}` }, { status: 400 });
    }

    const body = await request.json();
    const validationError = validateEventoData(body);

    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    const { title, description, date, location, duration, capacity } = body;
    const parsedDate = new Date(date);

    const eventoCreado = await prisma.evento.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        date: parsedDate,
        location: location.trim(),
        duration: duration.trim(),
        capacity,
        programId,
      },
    });

    return NextResponse.json(eventoCreado, { status: 201 });
  } catch (error) {
    console.error("Error al crear evento:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const rawProgramId = context.params.programId;
    const programId = validateProgramId(rawProgramId);

    if (!programId) {
      return NextResponse.json({ message: `programId inválido: ${rawProgramId}` }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json({ message: "Falta el parámetro eventId." }, { status: 400 });
    }

    const id = parseInt(eventId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: "eventId debe ser un número válido." }, { status: 400 });
    }

    const evento = await prisma.evento.findUnique({ where: { id } });
    if (!evento || evento.programId !== programId) {
      return NextResponse.json({ message: "Evento no encontrado o no pertenece al programa." }, { status: 404 });
    }

    // 👇 Transacción que borra inscripciones y luego el evento
    await prisma.$transaction([
      prisma.inscripcionPorEvento.deleteMany({
        where: { eventoId: id },
      }),
      prisma.evento.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json({ message: "Evento y participantes eliminados correctamente." }, { status: 200 });

  } catch (error) {
    console.error("Error al eliminar evento:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}


export async function PUT(request, context) {
  try {
    const rawProgramId = context.params.programId;
    const programId = validateProgramId(rawProgramId);

    if (!programId) {
      return NextResponse.json({ message: `programId inválido: ${rawProgramId}` }, { status: 400 });
    }

    const body = await request.json();
    const { id: eventId, ...updateData } = body;
    const id = parseInt(eventId, 10);

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID del evento inválido." }, { status: 400 });
    }

    const evento = await prisma.evento.findUnique({ where: { id } });
    if (!evento || evento.programId !== programId) {
      return NextResponse.json({ message: "Evento no encontrado o no pertenece al programa." }, { status: 404 });
    }

    const dataToUpdate = {};
    if (updateData.title?.trim()) dataToUpdate.title = updateData.title.trim();
    if (updateData.description?.trim()) dataToUpdate.description = updateData.description.trim();
    if (updateData.date) dataToUpdate.date = new Date(updateData.date);
    if (updateData.location?.trim()) dataToUpdate.location = updateData.location.trim();
    if (updateData.duration?.trim()) dataToUpdate.duration = updateData.duration.trim();
    if (typeof updateData.capacity === "number" && updateData.capacity > 0) dataToUpdate.capacity = updateData.capacity;

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ message: "No se proporcionaron datos para actualizar." }, { status: 400 });
    }

    const eventoActualizado = await prisma.evento.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(eventoActualizado, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar evento:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

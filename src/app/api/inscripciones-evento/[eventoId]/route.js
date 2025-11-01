export const dynamic = 'force-dynamic'
export const revalidate = 0

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendEventoUpdate } from "../stream/route"; // 🔹 Importa el emisor SSE
import { getServerSession } from "next-auth";       // ✅ Importa función de sesión
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request, { params }) {
  const { eventoId } = params;
  const id = parseInt(eventoId, 10);
  
  if (isNaN(id)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    const inscripciones = await prisma.inscripcionPorEvento.findMany({
      where: { eventoId: id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(inscripciones);
  } catch (error) {
    console.error("Error al cargar participantes:", error);
    return NextResponse.json({ message: "Error al cargar participantes" }, { status: 500 });
  }
} 

export async function DELETE(req, { params }) {
  try {
    const { eventoId } = params;
    const { id } = await req.json(); // id de la inscripción
    const session = await getServerSession(authOptions);

    if (!id || !eventoId) {
      return NextResponse.json({ message: "Datos inválidos" }, { status: 400 });
    }

    const inscripcion = await prisma.inscripcionPorEvento.findUnique({
      where: { id: Number(id) }
    });

    if (!inscripcion) {
      return NextResponse.json({ message: "Inscripción no encontrada" }, { status: 404 });
    }

    const programId = inscripcion.programId;
    const userId = inscripcion.userId || null;

    await prisma.$transaction([
      prisma.inscripcionPorEvento.delete({ where: { id: Number(id) } }),
      prisma.evento.update({
        where: { id: Number(eventoId) },
        data: { registered: { decrement: 1 } }
      })
    ]);
    
    sendEventoUpdate({
      action: "deleted",
      eventoId: Number(eventoId),
      programId,
      inscripcionId: Number(id),
      userId, // 🔹 Enviamos el userId correcto
    });
    
    return NextResponse.json({ message: "Inscripción eliminada con éxito" });
  } catch (error) {
    console.error("❌ Error al eliminar inscripción:", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}


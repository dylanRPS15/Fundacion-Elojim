import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { sendRegistroUpdate } from "../stream/route"; // 🔹 Importa el emisor SSE
import { sendEventoUpdate } from "@/app/api/inscripciones-evento/stream/route";

import {
  EstratoSocial,
  GrupoEtnico,
  NivelEducativo,
  AreaInteresCultural,
} from "@prisma/client";

// Enums válidos
const ESTRATOS = Object.values(EstratoSocial);
const GRUPOS_ETNICOS = Object.values(GrupoEtnico);
const NIVELES_EDUCATIVOS = Object.values(NivelEducativo);
const AREAS_INTERES = Object.values(AreaInteresCultural);

// Campos obligatorios
const CAMPOS_OBLIGATORIOS = [
  "nombreCompleto",
  "fechaNacimiento",
  "comuna",
  "estratoSocial",
  "edad",
  "grupoEtnico",
  "telefonoContacto",
  "direccion",
  "documentoIdentidad",
  "municipioDepartamento",
  "nivelEducativo",
  "ocupacion",
  "areaInteresPrincipal",
  "formacionPrevia",
  "perteneceGrupo",
  "diasDisponibles",
  "motivacion",
  "expectativas",
  "aceptaTerminos",
];

function validarDatos(data) {
  
  for (const campo of CAMPOS_OBLIGATORIOS) {
    if (data[campo] === undefined || data[campo] === null || data[campo] === "") {
      
      throw new Error(`El campo '${campo}' es obligatorio.`);
    }
  }

  if (!/^\d{8,10}$/.test(data.documentoIdentidad)) {
   
    throw new Error("El documento de identidad debe tener entre 8 y 10 dígitos.");
  }

  if (!/^\d{10}$/.test(data.telefonoContacto)) {
    
    throw new Error("El teléfono de contacto debe tener 10 dígitos.");
  }

  if (data.correoElectronico && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correoElectronico)) {
   
    throw new Error("El correo electrónico tiene un formato inválido.");
  }

  if (!ESTRATOS.includes(data.estratoSocial)) {
   
    throw new Error("El estrato social no es válido.");
  }

  if (!GRUPOS_ETNICOS.includes(data.grupoEtnico)) {
    
    throw new Error("El grupo étnico no es válido.");
  }

  if (!NIVELES_EDUCATIVOS.includes(data.nivelEducativo)) {
    
    throw new Error("El nivel educativo no es válido.");
  }

  if (!AREAS_INTERES.includes(data.areaInteresPrincipal)) {
    
    throw new Error("El área de interés principal no es válida.");
  }

  if (data.formacionPrevia === true && !data.detalleFormacion) {
    
    throw new Error("Debe detallar la formación previa.");
  }

  if (data.perteneceGrupo === true && !data.detalleGrupo) {

    throw new Error("Debe detallar el grupo cultural al que pertenece.");
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

    const {
      otrasAreasInteres, //  no existe en el modelo
      ...restData
    } = data;
   
    // Verificar si ya existe un registro con el mismo documento de identidad
    const existingRegistro = await prisma.registroCultural.findUnique({
      where: {
        documentoIdentidad: data.documentoIdentidad,
      },
    });

    if (existingRegistro) {
      console.error(`Error al registrar participante cultural: El documento de identidad '${data.documentoIdentidad}' ya está registrado.`);
      return NextResponse.json(
        { error: "El documento de identidad ya está registrado." },
        { status: 409 } // Código de estado para conflicto
      );
    }


    const nuevoRegistro = await prisma.registroCultural.create({
      data: {
        ...restData,
        fechaNacimiento: new Date(data.fechaNacimiento),
        usuario: {
          connect: { id: userId },
        },
      },
    });

    sendRegistroUpdate({
          action: "created",
          programId: "cultural",
          userId: userId,
        });
    
    return NextResponse.json(nuevoRegistro, { status: 201 });
  } catch (error) {
    console.error("Error al registrar participante cultural:", error); // <--- LOG DEL ERROR GENERAL
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
    const registros = await prisma.registroCultural.findMany({
      orderBy: { id: "desc" },
    });

    return NextResponse.json(registros, { status: 200 });
  } catch (error) {
    console.error("Error al obtener registros culturales:", error);
    return NextResponse.json(
      { error: "Error al obtener registros" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    const registro = await prisma.registroCultural.findUnique({
      where: { id },
    });

    if (!registro) {
      return NextResponse.json({ error: "Registro no encontrado" }, { status: 404 });
    }

    // 🔹 Obtener las inscripciones que se van a eliminar (para actualizar contadores)
    const inscripciones = await prisma.inscripcionPorEvento.findMany({
      where: {
        programId: "economia-plateada",
        userId: registro.userId,
      },
      select: { id: true, eventoId: true },
    });

    await prisma.$transaction([
      prisma.inscripcionPorEvento.deleteMany({
        where: { programId: "cultural", userId: registro.userId },
      }),
      prisma.registroCultural.delete({ where: { id } }),
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
      programId: "cultural",
      userId: registro.userId,
    });

     for (const insc of inscripciones) {
      sendEventoUpdate({
        action: "deleted",
        eventoId: insc.eventoId,
        programId: "cultural",
        inscripcionId: insc.id,
        userId: registro.userId,
      });
    }

    return NextResponse.json({ mensaje: "Registro eliminado correctamente" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar registro cultural:", error);
    return NextResponse.json(
      { error: "Error al eliminar el registro" },
      { status: 500 }
    );
  }
}
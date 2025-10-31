import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { EstratoSocial, GrupoEtnico } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { sendRegistroUpdate } from "../stream/route"; // 🔹 Importa el emisor SSE

// Enums válidos
const ESTRATOS_VALIDOS = Object.values(EstratoSocial);
const GRUPOS_ETNICOS_VALIDOS = Object.values(GrupoEtnico);

// Tecnologías y áreas de interés válidas (puedes personalizar esta lista)
const TECNOLOGIAS_VALIDAS = [
    "Desarrollo web (HTML, CSS, JavaScript)",
    "Backend (Python, Java, Node.js, etc.)",
    "Bases de datos (MySQL, PostgreSQL, MongoDB, etc.)",
    "Desarrollo móvil (Android, iOS, Flutter, React Native)",
    "Inteligencia Artificial / Machine Learning",
    "Ciberseguridad",
    "Otras",
  ];

const AREAS_INTERES_VALIDAS = [
  "Desarrollo de Aplicaciones",
    "Inteligencia Artificial y Aprendizaje Automático",
    "Bases de Datos y Big Data",
    "Ciberseguridad",
    "Computación en la Nube y DevOps",
    "Internet de las Cosas (IoT)",
    "Realidad Virtual y Aumentada",
    "Blockchain y Criptomonedas",
    "Ingeniería de Software y Metodologías de Desarrollo",
    "Software para Educación e Inclusión",
    "Otras"
];

const CAMPOS_OBLIGATORIOS = [
  // Datos personales
  "nombreCompleto",
  "tipoDocumento",
  "numeroDocumento",
  "fechaNacimiento",
  "telefonoContacto",
  "direccion",
  "comuna",
  "estratoSocial",
  "edad",
  "grupoEtnico",

  // Vinculación
  "modalidadVinculacion",
  "institucionEducativa",
  "programaAcademico",
  "semestreNivel",
  "tiempoDisponible",

  // Experiencia y habilidades
  "tecnologias",

  // Motivación e intereses
  "areasInteres",
  "motivacion",

  // Autorización
  "aceptaTerminos",
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

  if (!Array.isArray(data.tecnologias)) {
    throw new Error("El campo 'tecnologias' debe ser una lista.");
  }

  if (!Array.isArray(data.areasInteres)) {
    throw new Error("El campo 'areasInteres' debe ser una lista.");
  }

  const tecnologiasInvalidas = data.tecnologias.filter(
    (tec) => !TECNOLOGIAS_VALIDAS.includes(tec)
  );

  if (tecnologiasInvalidas.length > 0) {
    throw new Error(
      `Las siguientes tecnologías no son válidas: ${tecnologiasInvalidas.join(", ")}`
    );
  }

  const areasInvalidas = data.areasInteres.filter(
    (area) => !AREAS_INTERES_VALIDAS.includes(area)
  );

  if (areasInvalidas.length > 0) {
    throw new Error(
      `Las siguientes áreas de interés no son válidas: ${areasInvalidas.join(", ")}`
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

    // Eliminar campo no soportado por Prisma
    const {
      otrasAreasInteres, // ❌ no existe en el modelo
      ...restData
    } = data;

    const nuevoRegistro = await prisma.registroSoftwareFactory.create({
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
      programId: "semillero-innovacion",
      userId: userId,
    });
  

    return NextResponse.json(nuevoRegistro, { status: 201 });

  } catch (error) {
    console.error("Error al registrar en Software Factory:", error);
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
    const registros = await prisma.registroSoftwareFactory.findMany({
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

    const registro = await prisma.registroSoftwareFactory.findUnique({
      where: { id },
    });

    if (!registro) {
      return new Response("Registro no encontrado", { status: 404 });
    }

    await prisma.registroSoftwareFactory.delete({
      where: { id },
    });

    sendRegistroUpdate({
      action: "deleted",
      programId: "software-factory",
      userId: registro.userId,
    });

    return new Response("Registro eliminado exitosamente", { status: 200 });
  } catch (error) {
    console.error("❌ Error al eliminar registro:", error);
    return new Response("Error interno al eliminar registro", { status: 500 });
  }
}


export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req, { params }) {
    try {
        // Asegúrate de que `params` sea resuelto
        const { id } =  params;  // Resolviendo la promesa `params`

        const parsedId = parseInt(id);  // Convierte el id a un número entero
        if (isNaN(parsedId)) {
            return new Response("ID inválido", { status: 400 });
        }

        const post = await prisma.post.findUnique({
            where: { id: parsedId },  // Utiliza el ID validado y parseado
        });

        if (!post) {
            return new Response("Noticia no encontrada", { status: 404 });
        }

        return new Response(JSON.stringify(post), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("❌ Error al obtener la noticia:", error);
        return new Response("Error interno del servidor", { status: 500 });
    }
}

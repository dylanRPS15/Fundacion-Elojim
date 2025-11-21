// src/app/api/news/route.js

import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

// Configurar Cloudinary con variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getCloudinaryPublicIdFromUrl(url) {
  try {
    const { pathname } = new URL(url);
    const parts = pathname.split("/"); 
    // ['', 'dusvayvhf', 'image', 'upload', 'v1234567890', 'elojim', 'news', 'file.jpg']

    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;

    // Saltamos 'upload' y 'v<version>'
    const publicIdParts = parts.slice(uploadIndex + 2); 

    if (publicIdParts.length === 0) return null;

    // Quitar extensión al último elemento
    const last = publicIdParts[publicIdParts.length - 1];
    publicIdParts[publicIdParts.length - 1] = last.replace(/\.[^/.]+$/, "");

    return publicIdParts.join("/");
  } catch (e) {
    console.error("Error obteniendo public_id de URL Cloudinary:", url, e);
    return null;
  }
}

export async function POST(req) {
  try {
    // 🔐 Obtener token JWT desde la cookie
    const token = await getToken({ req });
    console.log("TOKEN RECIBIDO:", token);

    if (!token || !token.sub) {
      return new Response("No autorizado", { status: 401 });
    }

    const authorId = parseInt(token.sub, 10); // ID del usuario logueado

    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content") || "";

    // Obtener todas las imágenes del formulario
    const images = formData.getAll("images") || [];

    if (images.length > 5) {
      return new Response("Máximo 5 imágenes permitidas", { status: 400 });
    }

    const imagePaths = [];

    // Subir cada imagen a Cloudinary
    for (const file of images) {
      // Por si llegara algún valor raro en el array
      if (!file || typeof file === "string" || typeof file.arrayBuffer !== "function") {
        continue;
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      const dataURI = `data:${file.type};base64,${base64}`;

      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: "elojim/news", // carpeta opcional en Cloudinary
      });

      // Guardamos la URL segura en la BD
      imagePaths.push(uploadResult.secure_url);
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
        images: imagePaths, // ahora son URLs absolutas de Cloudinary
      },
    });

    return new Response(JSON.stringify(post), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (error) {
    console.error("❌ Error al crear noticia:", error);
    return new Response("Error interno", { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });

    return new Response(JSON.stringify(posts), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error al obtener noticias:", error);
    return new Response("Error al obtener noticias", { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json(); // id de la noticia a eliminar

    if (!id) {
      return new Response("ID de noticia requerido", { status: 400 });
    }

    const numericId = typeof id === "string" ? parseInt(id, 10) : id;

    // Buscar el post
    const postToDelete = await prisma.post.findUnique({
      where: { id: numericId },
    });

    if (!postToDelete) {
      return new Response("Noticia no encontrada", { status: 404 });
    }

    // 🔹 Intentar borrar las imágenes de Cloudinary
    if (Array.isArray(postToDelete.images)) {
      const deletePromises = postToDelete.images
        .filter((url) => typeof url === "string" && url.startsWith("http"))
        .map(async (url) => {
          const publicId = getCloudinaryPublicIdFromUrl(url);
          if (!publicId) return;

          try {
            const result = await cloudinary.uploader.destroy(publicId);
            console.log("Cloudinary destroy:", publicId, result);
          } catch (err) {
            console.error("Error eliminando imagen de Cloudinary:", publicId, err);
          }
        });

      await Promise.allSettled(deletePromises);
    }

    // 🔹 Borrar el registro en la BD
    await prisma.post.delete({
      where: { id: numericId },
    });

    return new Response("Noticia eliminada exitosamente", {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error al eliminar noticia:", error);
    return new Response("Error interno al eliminar noticia", { status: 500 });
  }
}


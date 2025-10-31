"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import ProtectedAdmin from "@/components/ProtectedAdmin";
import { useToast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const { toast } = useToast(); 
  const [loading, setLoading] = useState(true);

  // Fetch posts from the API
  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        const data = await res.json();
        setPosts(data); // Set the posts to state
      } else {
        console.error("Error fetching posts");
      }
    } catch (error) {
      console.error("Error fetching posts", error);
    } finally {
      setLoading(false); // Stop loading when data is fetched
    }
  };

  // Delete post function
  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/news", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        // Remove the deleted post from the state to reflect the changes immediately
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
        toast({
                title: "Post eliminado",
                description: "El post ha sido eliminado correctamente.",
              });
      } else {
        console.error("Error eliminando el post");
      }
    } catch (error) {
      console.error("Error eliminando el post", error);
    }
  };

  // Fetch posts when the component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return <div>Cargando posts...</div>;
  }

  return (
    <ProtectedAdmin>
    <ContentLayout title="All Posts">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Inicio</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Posts</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6">
          {/* Encabezado con botón de nueva noticia */}
          <div className="flex items-center justify-between">
            <h2 className="
                text-4xl md:text-3xl font-extrabold tracking-tight 
                text-gray-900
                drop-shadow-[0_2px_4px_rgba(27,60,140,0.25)]
                relative inline-block
                after:content-[''] after:block after:h-[3px] after:w-50 
                after:bg-gradient-to-r after:from-blue-300 after:to-gray-900
                after:mx-auto after:mt-0 after:rounded-full
                animate-fadeIn
              ">
                Noticias Publicadas</h2>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-400 bg-blue-200 hover:bg-gray-50 shadow-sm transition"
            >
              + Nueva noticia
            </Link>
          </div>

          {/* Tabla de noticias */}
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full table-auto border-separate border-spacing-y-2">
              <thead className="bg-blue-200">
                <tr className="text-left text-sm font-semibold text-gray-600">
                  <th className="py-2 px-4">Título</th>
                  <th className="py-2 px-4">Contenido</th>
                  <th className="py-2 px-4">Imágenes</th>
                  <th className="py-2 px-4">Fecha de creación</th>
                  <th className="py-2 px-4">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {posts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No hay noticias registradas.
                    </td>
                  </tr>
                )}

                {posts.map((post) => (
                  <tr key={post.id} className="bg-white hover:bg-gray-50 rounded-xl shadow-sm text-sm">
                    <td className="py-3 px-4 font-medium text-gray-800">{post.title}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {post.content ? post.content.slice(0, 120) + (post.content.length > 120 ? "…" : "") : "—"}
                    </td>
                    <td className="py-3 px-4">{Array.isArray(post.images) ? post.images.length : 0}</td>
                    <td className="py-3 px-4">
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString("es-CO") : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-800 underline underline-offset-2"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </ContentLayout>
    </ProtectedAdmin>
  );
}

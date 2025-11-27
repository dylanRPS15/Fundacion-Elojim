"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Gallery from "../../../components/News/Gallery";
import { motion } from "framer-motion";
import { BookOpen, Image as ImageIcon, Sparkles } from "lucide-react";

export default function NewsDetailPage({ params }) {
  const { id } = params;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch(`/api/news/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 404) {
            setError("Noticia no encontrada.");
          } else {
            setError("Error al cargar la noticia.");
          }
          return;
        }

        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error("Error cargando noticia:", err);
        setError("Error al cargar la noticia.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadPost();
    }
  }, [id]);

  // === ESTADOS DE CARGA / ERROR ===
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fdfdfb] via-[#fafafa] to-[#f7f8fa] text-gray-800">
        <Navbar />
        <main className="flex-grow max-w-5xl mx-auto w-full px-4 md:px-6 pt-20 pb-10 flex items-center justify-center">
          <p className="text-gray-600">Cargando noticia...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fdfdfb] via-[#fafafa] to-[#f7f8fa] text-gray-800">
        <Navbar />
        <main className="flex-grow max-w-5xl mx-auto w-full px-4 md:px-6 pt-20 pb-10 flex items-center justify-center">
          <p className="text-red-500">
            {error ?? "No se pudo encontrar la noticia."}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  // === RENDER NORMAL CUANDO YA TENEMOS post ===
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fdfdfb] via-[#fafafa] to-[#f7f8fa] text-gray-800">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 md:px-6 pt-20 pb-10">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-gradient-to-b from-[#111827] via-[#1f2937] to-[#0f172a]"
        >
          {/* === ENCABEZADO === */}
          <header className="relative text-center py-10 px-4 md:px-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#312e81] to-[#4c1d95] opacity-90"></div>
            <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="relative z-10"
            >
              <Sparkles className="mx-auto mb-3 text-amber-400" size={28} />
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3 drop-shadow-md text-white">
                {post.title}
              </h1>
              <div className="flex justify-center mb-3">
                <div className="h-[3px] w-20 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full shadow-lg"></div>
              </div>
              <p className="text-gray-300 italic text-xs tracking-wide">
                Publicado el{" "}
                {new Date(post.createdAt || Date.now()).toLocaleDateString(
                  "es-CO",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </motion.div>
          </header>

          {/* === DESCRIPCIÓN === */}
          <section className="px-6 md:px-10 py-10 bg-gradient-to-br from-[#1e293b] to-[#0f172a] relative">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="text-2xl font-semibold mb-5 flex items-center justify-center gap-2 text-amber-400"
              >
                <BookOpen size={22} /> Descripción
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[#f8fafc]/10 via-[#ffffff]/5 to-[#0f172a]/20 rounded-2xl shadow-inner border border-white/10 p-6 backdrop-blur-sm"
              >
                <p className="whitespace-pre-line text-base md:text-lg font-serif leading-relaxed text-gray-100">
                  {post.content || "(Sin contenido disponible)"}
                </p>
              </motion.div>
            </div>
          </section>

          {/* === GALERÍA === */}
          {post.images && post.images.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="px-6 md:px-10 py-10 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#111827]"
            >
              <div className="max-w-5xl mx-auto text-center">
                <h2 className="text-2xl font-semibold mb-6 flex items-center justify-center gap-2 text-amber-400">
                  <ImageIcon size={22} /> Galería destacada
                </h2>

                <div className="rounded-2xl border border-amber-400/20 bg-[#ffffff]/5 shadow-lg p-4 md:p-6">
                  <Gallery images={post.images} />
                </div>
              </div>
            </motion.section>
          )}

          {/* === PIE FINAL === */}
          <footer className="bg-gradient-to-r from-[#111827] via-[#1e293b] to-[#111827] text-gray-300 text-center py-8 px-4 border-t border-white/10">
            <h3 className="text-sm md:text-base font-semibold text-amber-400 tracking-wide mb-1">
              Fundación Elojim Jadach
            </h3>
            <div className="w-12 h-[2px] bg-amber-400 mx-auto my-2"></div>
          </footer>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

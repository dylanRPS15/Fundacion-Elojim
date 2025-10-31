"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, Newspaper } from "lucide-react";

export default function NewsListPage() {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const router = useRouter();

  // === Obtener noticias ===
  useEffect(() => {
    const fetchNews = async () => {
      const res = await fetch("/api/news");
      const data = await res.json();
      setNews(data);
    };
    fetchNews();
  }, []);

  // === Lógica de paginación ===
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = news.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#fdfdfb] via-[#fafafa] to-[#f7f8fa] text-gray-800">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-16">
        {/* === Encabezado === */}
        <div className="text-center mb-12">
          <Newspaper className="mx-auto text-amber-500 mb-3" size={32} />
          <h1 className="text-4xl font-bold text-gray-900 font-serif">
            Noticias Recientes
          </h1>
          <p className="text-gray-600 mt-2">
            Entérate de las últimas noticias publicadas en nuestro sitio web.
          </p>
          <div className="w-20 h-[3px] bg-amber-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* === Lista de noticias === */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentNews.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`/news/${item.id}`)}
              className="cursor-pointer bg-white shadow-sm hover:shadow-lg rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 group"
            >
              <div className="h-48 w-full bg-gray-100 overflow-hidden">
                {item.images && item.images[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <Newspaper size={32} />
                  </div>
                )}
              </div>

              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 truncate group-hover:text-amber-600 transition-colors">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {item.content || "Sin contenido disponible"}
                </p>
                <p className="text-xs text-gray-400 mt-3">
                  {new Date(item.createdAt || Date.now()).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* === Navegación de páginas === */}
        {news.length > itemsPerPage && (
          <div className="flex items-center justify-between mt-12 text-sm md:text-base">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-5 py-2 rounded-full border ${
                currentPage === 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100 transition"
              }`}
            >
              <ArrowLeft size={18} /> Regresar
            </button>

            <p className="text-gray-600">
              Página <span className="font-semibold">{currentPage}</span> de{" "}
              <span className="font-semibold">{totalPages}</span>
            </p>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-5 py-2 rounded-full border ${
                currentPage === totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100 transition"
              }`}
            >
              Siguiente <ArrowRight size={18} />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

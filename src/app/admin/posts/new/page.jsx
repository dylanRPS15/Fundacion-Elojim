"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Newspaper } from "lucide-react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import RegisterNewsPage from "@/app/registerNews/page";
import ProtectedAdmin from "@/components/ProtectedAdmin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export default function NewPostPage() {
  return (
    <ProtectedAdmin>
      <ContentLayout title="Nueva Noticia">
        {/* === MIGAS DE PAN === */}
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
              <BreadcrumbLink asChild>
                <Link href="/admin/posts">Noticias</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Crear nueva</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* === ENCABEZADO === */}
        <div className="flex items-center justify-between mt-8 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-100 shadow-md shadow-blue-200">
              <Newspaper className="text-blue-600 w-6 h-6" />
            </div>
            <div>
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
                Crear nueva noticia
              </h2>
              <p className="text-gray-500 text-sm">
                Añade un nuevo artículo al sitio principal de la fundación
              </p>
            </div>
          </div>

          <Link
            href="/admin/posts"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
        </div>

        {/* === CONTENEDOR PRINCIPAL CON ANIMACIÓN === */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-lg shadow-blue-100 backdrop-blur-sm"
        >
          <RegisterNewsPage />
        </motion.div>
      </ContentLayout>
    </ProtectedAdmin>
  );
}

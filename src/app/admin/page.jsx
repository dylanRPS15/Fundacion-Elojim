"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import ProtectedAdmin from "@/components/ProtectedAdmin";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { Newspaper, CalendarDays, FolderOpen } from "lucide-react";

export default function DashboardPage() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;

  const cards = [
    {
      title: "Gestión de Noticias",
      description:
        "Agregar, listar o eliminar noticias relevantes para la comunidad.",
      color: "#2563EB",
      icon: <Newspaper size={36} strokeWidth={1.7} />,
    },
    {
      title: "Eventos por Programa",
      description:
        "Agregar, listar, eliminar o editar eventos asociados a cada programa.",
      color: "#10B981",
      icon: <CalendarDays size={36} strokeWidth={1.7} />,
    },
    {
      title: "Registros de Programas",
      description:
        "Agregar, listar, eliminar o ver los registros vinculados a cada programa.",
      color: "#F43F5E",
      icon: <FolderOpen size={36} strokeWidth={1.7} />,
    },
  ];

  return (
    <ProtectedAdmin>
      <ContentLayout title="Dashboard">
        {/* 🧭 Migas de pan */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Inicio</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* 🌈 Fondo decorativo */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-gradient-to-br from-blue-100 via-indigo-50 to-white blur-3xl opacity-50"></div>
        </div>

        {/* ✨ Encabezado con animación */}
        <motion.div
          className="mt-14 mb-16 text-center space-y-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Bienvenido al{" "}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Panel Administrativo
            </span>
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Gestiona noticias, eventos y registros de programas desde un solo lugar.
          </p>
        </motion.div>

        {/* 🧩 Tarjetas */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {cards.map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card
                className="relative overflow-hidden group border border-gray-200 dark:border-gray-700 rounded-3xl bg-white/80 dark:bg-gray-900/60 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-500"
              >
                {/* Fondo animado interno */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20"
                  style={{
                    background: `radial-gradient(circle at top left, ${item.color} 0%, transparent 70%)`,
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />

                <CardContent className="relative z-10 p-8 flex flex-col items-start space-y-4">
                  {/* Icono flotante */}
                  <motion.div
                    className="p-3 rounded-2xl shadow-lg text-white"
                    style={{ backgroundColor: item.color }}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    {item.icon}
                  </motion.div>

                  {/* Título */}
                  <h3
                    className="text-2xl font-semibold mt-2"
                    style={{ color: item.color }}
                  >
                    {item.title}
                  </h3>

                  {/* Descripción */}
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Línea decorativa animada */}
                  <motion.div
                    className="h-[3px] w-0 group-hover:w-28 rounded-full mt-3"
                    style={{ backgroundColor: item.color }}
                    transition={{ duration: 0.5 }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </ContentLayout>
    </ProtectedAdmin>
  );
}

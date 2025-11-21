"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { programs } from "@/data/programs";
import ProgramCard from "../../components/Eventos/ProgramCard";
import ProgramDetail from "../../components/Eventos/ProgramDetail";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePrograms } from "@/context/ProgramContext";

export default function ProgramasPage() {
  const { loadingPrograms } = usePrograms();
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleProgramClick = (program) => {
    if (loadingPrograms) return;
    setSelectedProgram(program);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  const filteredPrograms = programs.filter(
    (program) =>
      program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // 🔹 Tarjeta Skeleton con color y badge simulado
  const SkeletonCard = ({ color = "#e5e7eb" }) => (
    <div
      className="h-full cursor-wait overflow-hidden border-2 rounded-lg animate-pulse"
      style={{
        borderColor: color,
        backgroundColor: `${color}15`, // tono translúcido del color
      }}
    >
      <div className="p-6 space-y-4 flex flex-col justify-between h-full">
        {/* Parte superior: ícono y badge simulado */}
        <div className="flex justify-between items-center">
          {/* Círculo del ícono */}
          <div
            className="h-8 w-8 rounded-full opacity-30"
            style={{ backgroundColor: color }}
          />
          {/* Badge gris simulado */}
          <div className="h-5 w-16 bg-gray-300 rounded-full opacity-60" />
        </div>

        {/* Contenido textual simulado */}
        <div className="space-y-3">
          <div className="h-5 w-3/4 bg-gray-300 rounded" />
          <div className="h-3 w-4/5 bg-gray-200 rounded" />
          <div className="h-3 w-2/3 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1B3C8C] mb-4">
          Nuestros Programas Sociales
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explora nuestros programas sociales y únete a las iniciativas que están
          transformando vidas en nuestra comunidad.
        </p>
      </div>

      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar programas..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loadingPrograms}
        />
      </div>

      {/* 🔹 Mientras se cargan los programas, muestra skeletons */}
      {loadingPrograms ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, i) => (
            <SkeletonCard key={i} color={program.color} />
          ))}
        </div>
      ) : (
        <>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show">
            {filteredPrograms.map((program) => (
              <motion.div key={program.id} variants={item}>
                <ProgramCard program={program} onClick={handleProgramClick} />
              </motion.div>
            ))}
          </motion.div>

          {filteredPrograms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No se encontraron programas que coincidan con tu búsqueda.
              </p>
            </div>
          )}

          <ProgramDetail
            program={selectedProgram}
            isOpen={isDetailOpen}
            onClose={handleCloseDetail}
          />
        </>
      )}
    </div>
  );
}
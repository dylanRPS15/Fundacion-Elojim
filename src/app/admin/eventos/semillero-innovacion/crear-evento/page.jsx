"use client";

import { useState } from "react";
import ProtectedAdmin from "@/components/ProtectedAdmin";
import ModalCrearEvento from "@/components/admin-panel/modal-crear-evento";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { programs } from "@/data/programs";

export default function SemilleroInnovacionEventoPage() {
  const [modalAbierto, setModalAbierto] = useState(false);

  // 🔹 Info del programa
  const program = programs.find((p) => p.id === "semillero-innovacion");
  const Icon = program.icon;

  return (
    <ProtectedAdmin>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-6 flex flex-col items-center relative overflow-hidden">

        {/* Fondo decorativo */}
        <motion.div
          className="absolute -z-10 top-0 left-0 w-full h-full opacity-50"
          style={{
            background: `radial-gradient(circle at 30% 10%, ${program.color}15 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Encabezado visual */}
        <motion.div
          className="flex flex-col items-center text-center mb-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="p-5 rounded-full shadow-lg"
            style={{
              backgroundColor: program.color,
              boxShadow: `0 4px 20px ${program.color}60`,
            }}
          >
            <Icon className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 mt-5">
            Crear Evento –{" "}
            <span className="text-blue-600">{program.title}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 max-w-lg">
            Diseña y registra un nuevo evento para el programa{" "}
            <b>{program.title}</b>. Administra fechas, cupos y detalles en un entorno optimizado.
          </p>
        </motion.div>

        {/* Card central */}
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-100 p-10 w-full max-w-lg text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Panel de Creación de Evento
          </h2>
          <p className="text-gray-500 mb-6">
            Pulsa el botón para registrar un nuevo evento dentro del sistema.
          </p>

          <motion.button
            onClick={() => setModalAbierto(true)}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-blue-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <PlusCircle className="w-5 h-5" />
            Agregar nuevo evento
          </motion.button>
        </motion.div>

        {/* Modal */}
        <ModalCrearEvento
          open={modalAbierto}
          onClose={() => setModalAbierto(false)}
          programId={program.id}
          onSave={() => console.log("Evento creado")}
        />
      </div>
    </ProtectedAdmin>
  );
}

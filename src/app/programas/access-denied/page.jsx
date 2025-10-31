"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, UserPlus } from "lucide-react";

export default function AccessDeniedProgramas() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0B1620] via-[#111827] to-gray-900 text-gray-100 dark:from-gray-50 dark:via-gray-100 dark:to-gray-200 transition-colors duration-500 px-6">
      {/* LOGO */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center mb-8"
      >
        <Image
          src="/images/logo2.webp"
          alt="Logo Fundación Elojim Jadach"
          width={90}
          height={90}
          className="rounded-full shadow-xl border border-white/20 dark:border-gray-300"
        />
        <h1 className="mt-3 text-2xl font-bold text-center text-white dark:text-gray-900">
          Fundación Elojim Jadach
        </h1>
      </motion.div>

      {/* TARJETA CENTRAL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-white/10 dark:bg-gray-100/60 backdrop-blur-md rounded-2xl border border-white/10 dark:border-gray-300 shadow-2xl p-8 w-full max-w-md text-center"
      >
        <h2 className="text-3xl font-semibold text-blue-400 dark:text-blue-600 mb-3">
          Acceso restringido
        </h2>
        <p className="text-gray-200 dark:text-gray-700 leading-relaxed mb-6">
          Esta sección de <span className="font-semibold text-white dark:text-gray-900">Programas</span> está 
          disponible solo para usuarios registrados o personal autorizado.
        </p>

        {/* BOTONES */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg"
          >
            <LogIn className="w-5 h-5" />
            Iniciar sesión
          </Link>

          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 dark:bg-gray-200/80 dark:hover:bg-gray-300 text-white dark:text-gray-800 font-medium rounded-lg transition-all duration-300"
          >
            <UserPlus className="w-5 h-5" />
            Registrarse
          </Link>
        </div>

        <p className="text-sm text-gray-400 dark:text-gray-600 mt-6">
          Si no tienes una cuenta, crea una para acceder a los programas y eventos disponibles.
        </p>
      </motion.div>

      {/* PIE */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-10 text-xs text-gray-400 dark:text-gray-600 text-center"
      >
        © {new Date().getFullYear()} Fundación Elojim Jadach. Todos los derechos reservados.
      </motion.p>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.warning("Por favor ingresa tu correo electrónico.");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("📩 Revisa tu correo electrónico para continuar.");
        setEmail("");
      } else {
        toast.error(data.error || "No se pudo enviar el correo.");
      }
    } catch {
      toast.error("Error al conectar con el servidor.");
    }
    setLoading(false);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-white to-[#e0e7ff] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Fondo decorativo suave */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_rgba(27,60,140,0.08),_transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-lg"
      >
        <Card className="bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-white/30 rounded-2xl overflow-hidden">
          {/* Encabezado corporativo */}
          <div className="flex flex-col items-center text-center p-8 border-b border-gray-100">
            <div className="relative w-20 h-20 mb-4">
              <Image
                src="/images/logoFundación_circular.png"
                alt="Fundación Elojim Jadach"
                fill
                className="object-cover rounded-full"
                sizes="(max-width: 80px) 100vw, 80px"
              />
            </div>
            <h1 className="text-3xl font-bold text-[#1B3C8C] mb-2">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="text-gray-600 max-w-sm">
              No te preocupes. Ingresa tu correo electrónico y te enviaremos un enlace seguro para restablecerla.
            </p>
          </div>

          {/* Formulario */}
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <MailCheck className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 focus-visible:ring-[#1B3C8C]"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1B3C8C] hover:bg-[#274fae] text-white text-lg py-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                {loading ? "Enviando..." : "Enviar enlace de recuperación"}
              </Button>

              <div className="text-center text-sm mt-3">
                <Link
                  href="/auth/login"
                  className="text-[#3B82F6] hover:underline"
                >
                  Volver al inicio de sesión
                </Link>
              </div>
            </form>
          </CardContent>

          {/* Pie elegante */}
          <div className="bg-gray-50 border-t border-gray-100 py-4 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Fundación Elojim Jadach — Todos los derechos reservados.
          </div>
        </Card>
      </motion.div>
    </section>
  );
}

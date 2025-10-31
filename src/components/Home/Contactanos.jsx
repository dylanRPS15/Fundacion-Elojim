"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";

const Contactanos = () => {
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    const nombre = e.target.nombre.value.trim();
    const email = e.target.email.value.trim();
    const asunto = e.target.asunto.value.trim();
    const mensaje = e.target.mensaje.value.trim();

    if (!nombre || !email || !asunto || !mensaje) {
      toast.warning("Por favor completa todos los campos.");
      setSending(false);
      return;
    }

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, asunto, mensaje }),
      });

      if (res.ok) {
        toast.success("✅ Tu mensaje fue enviado correctamente. ¡Gracias por contactarnos!");
        e.target.reset();
      } else {
        toast.success("❌ Ocurrió un error al enviar el mensaje.");
      }
    } catch (error) {
      toast.error("⚠️ No se pudo enviar el mensaje. Intenta nuevamente.");
    }

    setSending(false);
  };

  return (
    <section
      id="contacto"
      className="relative py-24 bg-gradient-to-b from-gray-50 via-white to-gray-100 overflow-hidden"
    >
      {/* Figuras suaves de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(27,60,140,0.05),_transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1B3C8C] tracking-tight drop-shadow-sm">
            Contáctanos
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-gray-600 text-lg leading-relaxed font-medium">
            ¿Tienes preguntas o deseas unirte a alguno de nuestros programas?
            Escríbenos, estaremos encantados de escucharte.
          </p>
          <div className="mt-4 w-20 h-[3px] bg-gradient-to-r from-[#1B3C8C] via-blue-400 to-[#F97316] mx-auto rounded-full" />
        </motion.div>

        {/* Contenido principal */}
        <div className="grid md:grid-cols-2 gap-14 items-start">
          {/* Información de contacto */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100"
          >
            <h3 className="text-2xl font-semibold text-[#1B3C8C] mb-6">
              Información de Contacto
            </h3>

            {[
              {
                icon: MapPin,
                title: "Dirección",
                text: "Av. Principal #123, Ciudad",
              },
              {
                icon: Phone,
                title: "Teléfono",
                text: "3173172333",
              },
              {
                icon: Mail,
                title: "Email",
                text: (
                  <>
                    fundacion@elojimjadach.org <br />
                    ginav.sm@elojimjadach.org
                  </>
                ),
              },
              {
                icon: Clock,
                title: "Horario de Atención",
                text: "Lunes a Viernes: 9:00 AM - 6:00 PM",
              },
            ].map(({ icon: Icon, title, text }, i) => (
              <div key={i} className="flex items-start space-x-4 group">
                <div
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-[#1B3C8C]/10 text-[#1B3C8C] group-hover:scale-110 transition-transform duration-500"
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{title}</h4>
                  <p className="text-gray-600 text-sm">{text}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Formulario */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-6 bg-white p-10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="nombre" className="text-sm font-semibold text-gray-700">
                  Nombre
                </label>
                <Input
                  name="nombre"
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  className="focus-visible:ring-[#1B3C8C]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email
                </label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="focus-visible:ring-[#1B3C8C]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="asunto" className="text-sm font-semibold text-gray-700">
                Asunto
              </label>
              <Input
                name="asunto"
                id="asunto"
                type="text"
                placeholder="Motivo de tu mensaje"
                className="focus-visible:ring-[#1B3C8C]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="mensaje" className="text-sm font-semibold text-gray-700">
                Mensaje
              </label>
              <Textarea
                name="mensaje"
                id="mensaje"
                placeholder="Escribe tu mensaje aquí..."
                className="min-h-[150px] focus-visible:ring-[#1B3C8C]"
              />
            </div>

            <Button
              disabled={sending}
              type="submit"
              className="w-full bg-[#1B3C8C] hover:bg-[#274fae] text-white py-5 rounded-xl font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
            >
              <Send className={`w-4 h-4 ${sending ? "animate-spin" : ""}`} />
              {sending ? "Enviando..." : "Enviar Mensaje"}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contactanos;

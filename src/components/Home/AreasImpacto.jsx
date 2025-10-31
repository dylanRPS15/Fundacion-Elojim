"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Cpu,
  Leaf,
  HeartHandshake,
} from "lucide-react";
import { motion } from "framer-motion";

const AreasImpacto = () => {
  const areas = [
    {
      title: "Empoderamiento de la Mujer",
      icon: Users,
      description:
        "Brindamos apoyo a mujeres en situación de vulnerabilidad mediante programas de capacitación, emprendimiento y acompañamiento social.",
      color: "#ff48d1ff",
      gradient: "from-[#fc12c1ff]/20 via-[#ff48d1ff]/10 to-white",
    },
    {
      title: "Innovación y Tecnología Aplicada",
      icon: Cpu,
      description:
        "Implementamos soluciones tecnológicas en sectores agropecuarios y sociales para optimizar procesos y mejorar la calidad de vida.",
      color: "#2563EB",
      gradient: "from-[#2563EB]/20 via-[#60A5FA]/10 to-white",
    },
    {
      title: "Seguridad Alimentaria Sostenible",
      icon: Leaf,
      description:
        "Promovemos la agricultura inteligente y sostenible para garantizar alimentos saludables y el cuidado del entorno.",
      color: "#16A34A",
      gradient: "from-[#16A34A]/20 via-[#86EFAC]/10 to-white",
    },
    {
      title: "Inclusión Social y Diversidad",
      icon: HeartHandshake,
      description:
        "Fomentamos espacios de respeto, equidad y participación activa para comunidades vulnerables y diversas.",
      color: "#F97316",
      gradient: "from-[#F97316]/20 via-[#FDBA74]/10 to-white",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* fondo con figuras sutiles */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,_rgba(27,60,140,0.05),_transparent_60%)]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <h2 className="
            text-4xl md:text-5xl font-extrabold tracking-tight 
            text-gray-900
            drop-shadow-[0_2px_4px_rgba(27,60,140,0.25)]
            relative inline-block
            after:content-[''] after:block after:h-[3px] after:w-16 
            after:bg-gradient-to-r after:from-blue-300 after:to-gray-900
            after:mx-auto after:mt-4 after:rounded-full
            animate-fadeIn
          ">
            Nuestras Áreas de Impacto
          </h2>

          <p className="
            mt-6 max-w-2xl mx-auto text-gray-600 text-base md:text-lg
            leading-relaxed font-medium tracking-wide
            animate-fadeIn
            ">
            Trabajamos en múltiples frentes para crear un impacto positivo y duradero 
            en nuestra comunidad a través de programas sociales, tecnológicos 
            y de sostenibilidad.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {areas.map(({ title, icon: Icon, description, color, gradient }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, rotateX: 15, y: 30 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: [0.23, 1, 0.32, 1] }}
              viewport={{ once: true }}
            >
              <Card
                className="
                  group relative border-0 rounded-2xl overflow-hidden
                  shadow-[0_8px_25px_rgba(0,0,0,0.06)]
                  hover:shadow-[0_14px_40px_rgba(0,0,0,0.08)]
                  transition-all duration-500 bg-white/95
                "
              >
                {/* Borde animado al hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                />

                <CardContent className="relative z-10 p-8 text-center">
                  {/* Ícono circular */}
                  <div
                    className="mx-auto mb-5 w-14 h-14 flex items-center justify-center rounded-full
                               shadow-inner transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundColor: `${color}15`,
                      color: color,
                    }}
                  >
                    <Icon className="w-7 h-7" strokeWidth={1.8} />
                  </div>

                  {/* Título */}
                  <h3
                    className="text-xl font-semibold mb-3 group-hover:text-[#F97316] transition-colors duration-500"
                    style={{ color }}
                  >
                    {title}
                  </h3>

                  {/* Descripción */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {description}
                  </p>

                  {/* Subrayado animado raro pero profesional */}
                  <div className="relative mt-5">
                    <span
                      className="block h-[2px] w-0 bg-gradient-to-r from-blue-300 via-gray-400 to-[#1B3C8C]
                                 mx-auto rounded-full transition-all duration-700 group-hover:w-3/4"
                    />
                  </div>
                </CardContent>

                {/* Efecto “halo” suave */}
                <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/20 transition-all duration-700" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AreasImpacto;

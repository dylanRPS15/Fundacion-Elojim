"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye } from "lucide-react";

const MisionVision = () => {
  const cards = [
    {
      title: "Nuestra Misión",
      color: "#1B3C8C",
      Icon: Target,
      text: `La Fundación Elojim Jadach promueve proyectos basados en desarrollo sostenible, inclusión y tecnología social. 
      Buscamos generar un cambio duradero mediante la innovación y la colaboración con modelos de emprendimiento e investigación.`,
      grad: "from-[#1B3C8C]/30 via-transparent to-[#1B3C8C]/10",
    },
    {
      title: "Nuestra Visión",
      color: "#F97316",
      Icon: Eye,
      text: `Aspiramos a un mundo donde la igualdad, el respeto y la solidaridad sean pilares de una sociedad inclusiva. 
      Trabajamos por inspirar y empoderar comunidades para construir juntos un futuro de oportunidades y justicia social.`,
      grad: "from-[#F97316]/35 via-transparent to-[#F97316]/10",
    },
  ];

  return (
    <section id="nosotros" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10">
          {cards.map(({ title, color, Icon, text, grad }, i) => (
            <div
              key={title}
              className="
                group relative rounded-2xl
                shadow-[0_18px_50px_rgba(16,24,40,0.06)]
                transition-all duration-500
                hover:shadow-[0_28px_70px_rgba(16,24,40,0.10)]
                hover:-translate-y-1
              "
            >
              {/* Borde degradado sutil */}
              <div
                className={`
                  pointer-events-none absolute inset-0 rounded-2xl p-[1px]
                  before:content-[''] before:absolute before:inset-0 before:rounded-2xl
                  before:bg-gradient-to-br ${grad}
                  before:opacity-70 before:transition-opacity before:duration-500
                  group-hover:before:opacity-100
                `}
              />

              {/* Card real */}
              <Card className="relative rounded-2xl border border-gray-100 bg-white/95">
                {/* Línea superior de acento */}
                <div
                  className="absolute top-0 left-0 w-full h-1.5 rounded-t-2xl"
                  style={{ backgroundColor: color }}
                />

                <CardContent className="px-7 py-8">
                  {/* Encabezado con icono */}
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="inline-flex items-center justify-center rounded-xl
                                 bg-gray-50 ring-1 ring-gray-200
                                 w-11 h-11 transition-all duration-500
                                 group-hover:scale-105"
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color }}
                      />
                    </span>
                    <h3
                      className="text-2xl font-bold tracking-tight"
                      style={{ color }}
                    >
                      {title}
                    </h3>
                  </div>

                  {/* Divider sutil animado */}
                  <div className="relative h-[2px] bg-gray-100 overflow-hidden mb-5 rounded">
                    <span
                      className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-100
                                 transition-all duration-700 group-hover:w-full"
                    />
                  </div>

                  {/* Texto */}
                  <p className="text-gray-600 leading-relaxed text-justify">
                    {text}
                  </p>

                  {/* Línea inferior que “encierra” al hover */}
                  <div className="mt-7">
                    <span
                      className="block h-[1.5px] w-0 bg-current opacity-70 transition-all duration-700"
                      style={{ color }}
                    />
                  </div>
                </CardContent>

                {/* Halo muy tenue al hover */}
                <div className="absolute -inset-1 rounded-2xl bg-white/0 group-hover:bg-white/20 transition-colors duration-500 pointer-events-none" />
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MisionVision;

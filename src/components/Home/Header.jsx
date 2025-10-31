"use client";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <section
      id="inicio"
      className="relative h-[90vh] flex items-center justify-center bg-white overflow-hidden"
    >
      {/* Imagen de fondo con filtro elegante */}
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3')] bg-cover bg-center scale-105 transform transition-all duration-1000 hover:scale-110"
      ></div>

      {/* Capa de color institucional */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1B3C8C]/80 via-[#1B3C8C]/70 to-[#1B3C8C]/90 mix-blend-multiply"></div>

      {/* Contenido */}
      <div className="relative z-10 text-center text-white px-6 animate-fadeIn">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md">
          Fundación Elojim Jadach
        </h1>
        <p className="text-lg md:text-2xl text-gray-100 mt-4 mb-8 font-light">
          Transformando vidas, construyendo futuros
        </p>

        <Button
          size="lg"
          className="bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold rounded-full px-8 py-6 text-lg transition-all duration-300 shadow-lg hover:shadow-[#F97316]/40 hover:scale-105"
        >
          Conoce más
        </Button>
      </div>

      {/* Degradado inferior para transición suave */}
      <div className="absolute bottom-0 left-0 w-full h-[6rem] bg-gradient-to-b from-transparent to-white/95"></div>
    </section>
  );
};

export default Header;

"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* === Secciones principales === */}
        <div className="grid grid-cols-1 sm:grid-cols-[1.6fr_1fr_1fr_1fr] gap-y-10 gap-x-10 lg:gap-x-12">

          {/* Columna 1 - Logo y descripción */}
          <div className="pr-20">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo2.webp"
                alt="Logo Fundación Elojim Jadach"
                width={48}
                height={48}
                className="rounded-full shadow-sm"
              />
              <h2 className="text-lg font-semibold text-white">
                Fundación Elojim Jadach
              </h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Transformando vidas, construyendo futuros más brillantes para
              nuestra comunidad.
            </p>
          </div>

          {/* Columna 2 - Enlaces */}
          <div>
            <h3 className="text-m font-bold uppercase tracking-wide text-gray-100 mb-4">
              Enlaces
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Inicio", href: "/" },
                { label: "Nosotros", href: "/#nosotros" },
                { label: "Programas", href: "/programas" },
                { label: "Contacto", href: "/#contacto" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 - Legal */}
          <div>
            <h3 className="text-m font-bold uppercase tracking-wide text-gray-100 mb-4">
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Términos y Condiciones", href: "/terminos" },
                { label: "Política de Privacidad", href: "/privacidad" },
                { label: "Aviso Legal", href: "/aviso-legal" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4 - Redes sociales */}
          <div>
            <h3 className="text-m font-bold uppercase tracking-wide text-gray-100 mb-4">
              Síguenos
            </h3>
            <div className="flex items-center gap-4">
              <SocialIcon
                href="https://www.facebook.com/elojimjadach"
                src="/icons/facebook.svg"
                alt="Facebook"
              />
              <SocialIcon
                href="https://x.com/elojimjadach?s=21"
                src="/icons/x.svg"
                alt="X"
              />
              <SocialIcon
                href="https://www.instagram.com/elojim.jadach_fdn?igsh=MnVwOHphaG85a3Bv&utm_source=qr"
                src="/icons/instagram.svg"
                alt="Instagram"
              />
              <SocialIcon
                href="https://www.tiktok.com/@elojim.jadach?_t=ZS-8uO7nzo72rX&_r=1"
                src="/icons/tiktok.svg"
                alt="TikTok"
              />
            </div>
          </div>
        </div>

        {/* === Línea inferior === */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} Fundación Elojim Jadach. Todos los
            derechos reservados. NIT 901714461-5
          </p>
        </div>
      </div>
    </footer>
  );
}

/* === Componente reutilizable para íconos sociales === */
function SocialIcon({ href, src, alt }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-full bg-white/5 hover:bg-white/15 transition-colors duration-300"
    >
      <Image
        src={src}
        alt={alt}
        width={20}
        height={20}
        className="object-contain brightness-95 hover:brightness-125 transition"
      />
    </Link>
  );
}

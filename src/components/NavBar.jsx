"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVoluntario, setIsVoluntario] = useState(false);

  useEffect(() => {
    
    if (session && session.user) {
      // Verifica si rolId existe, de lo contrario intenta obtenerlo a través de una API
      if (session.user.rolId !== undefined) {
        setIsAdmin(session.user.rolId === 2);
        // setIsVoluntario(session.user.rolId === 2);
      }
    } else {
      setIsAdmin(false);
      setIsVoluntario(false);
    }
  }, [session]);

  const getConditionalNavItems = () => {
  let items = [
    { href: "/", label: "Inicio" },
    { href: "/#nosotros", label: "Nosotros" },
    { href: "/news", label: "Noticias" },
    { href: "/#contacto", label: "Contáctanos" },
  ];

  // Solo mostrar "Programas" si el usuario está autenticado
  if (status === "authenticated") {
    items.push({ href: "/programas", label: "Programas" });
  }

  // Agregar enlace admin si corresponde
  if (isAdmin) {
    items.push({ href: "/admin", label: "Panel Administrativo" });
  }

  return items;
};


  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  // Lista de navegación final con elementos condicionales
  const finalNavItems = getConditionalNavItems();

  return (
    <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all duration-500">
      <div className="container mx-auto px-5">
        <div className="flex items-center justify-between h-16">
          {/* === LOGO Y TÍTULO === */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/logoFundación_rectangular.png"
              alt="Fundación Elojim"
              width={44}
              height={44}
              className="rounded-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="leading-tight">
              <h1 className="text-[1.25rem] font-semibold tracking-tight text-[#1B3C8C] group-hover:text-[#0E2970] transition-colors duration-300">
                Fundación <span className="text-gray-800">Elojim</span>
              </h1>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-gray-500 font-medium mt-[1px]">
                Jadach
              </p>
            </div>
          </Link>

          {/* === NAV DESKTOP === */}
          <nav className="hidden md:flex items-center space-x-7">
            {finalNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-item text-[0.95rem] font-medium text-gray-700"
              >
                <span>{item.label}</span>
              </Link>
            ))}

            {/* === SESIÓN === */}
            {status === "authenticated" ? (
              <div className="flex items-center gap-3 pl-2 border-l border-gray-300">
                <span className="text-sm text-gray-600">
                  Hola, <span className="font-semibold">{session.user.name}</span>
                </span>
                <Button
                  variant="ghost"
                  className="text-[#1B3C8C] hover:text-[#0E2970] hover:bg-gray-100 transition-all duration-300 p-0"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span>Salir</span>
                </Button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center text-[#1B3C8C] hover:text-[#0E2970] transition-all duration-300"
              >
                <User className="h-5 w-5 mr-1" />
                <span className="font-medium">Iniciar sesión</span>
              </Link>
            )}
          </nav>

          {/* === MENÚ MÓVIL === */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" className="p-0 text-[#1B3C8C] hover:text-[#0E2970] transition-transform hover:scale-110">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-white text-gray-800 shadow-xl animate-slide-in border-l border-gray-200"
            >
              <SheetHeader>
                <SheetTitle className="text-[#1B3C8C] text-xl font-bold tracking-wide">
                  Menú
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col space-y-4 mt-6">
                {finalNavItems.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium hover:text-[#1B3C8C] transition-all duration-300 pl-1 link-fade"
                    onClick={() => setIsOpen(false)}
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="pt-4 border-t border-gray-300 mt-4">
                  {status === "authenticated" ? (
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600">
                        Sesión iniciada como{" "}
                        <span className="font-semibold text-[#1B3C8C]">
                          {session.user.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-lg text-[#1B3C8C] hover:text-[#0E2970] hover:bg-gray-100 transition-all duration-300"
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        <span>Cerrar sesión</span>
                      </Button>
                    </div>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="flex items-center text-lg text-[#1B3C8C] hover:text-[#0E2970] transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5 mr-2" />
                      <span>Iniciar sesión</span>
                    </Link>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* degradado sutil */}
    </header>
  );
};

export default Navbar;
"use client";

import { Menu } from "@/components/admin-panel/menu";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { PanelsTopLeft, Menu as MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);

  // ✅ Hooks deben declararse siempre, nunca condicionales
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Si aún no existe el sidebar, no renderices nada visual
  if (!sidebar) return <></>;

  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;

  return (
    <>
      {/* Botón hamburguesa para móviles */}
      {isMobile && (
        <Button
          onClick={() => setShowSidebar(!showSidebar)}
          className="fixed top-[4.25rem] left-4 z-50 bg-white border shadow-md hover:bg-gray-100 rounded-lg p-2"
          size="icon"
        >
          {showSidebar ? (
            <X className="h-5 w-5 text-gray-700" />
          ) : (
            <MenuIcon className="h-5 w-5 text-gray-700" />
          )}
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all ease-in-out duration-300 shadow-lg bg-background",
          !getOpenState() ? "w-[90px]" : "w-72",
          settings.disabled && "hidden",
          isMobile
            ? showSidebar
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        )}
      >
        {!isMobile && <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />}

        <div
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className="relative h-full flex flex-col px-3 py-4 overflow-hidden"
        >
          {/* Logo */}
          <Button
            className={cn(
              "transition-transform ease-in-out duration-300 mb-1",
              !getOpenState() ? "translate-x-1" : "translate-x-0"
            )}
            variant="link"
            asChild
          >
            <Link href="/admin" className="flex items-center gap-2">
              <PanelsTopLeft className="w-6 h-6 mr-1" />
              <h1
                className={cn(
                  "font-bold text-lg whitespace-nowrap transition-[transform,opacity] ease-in-out duration-300",
                  !getOpenState()
                    ? "-translate-x-96 opacity-0"
                    : "translate-x-0 opacity-100"
                )}
              >
                Elojimjadach
              </h1>
            </Link>
          </Button>

          {/* Menú */}
          <Menu isOpen={getOpenState()} />
        </div>
      </aside>

      {/* Fondo oscuro cuando sidebar está abierta en móvil */}
      {isMobile && showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-30 transition-opacity duration-300"
        />
      )}
    </>
  );
}

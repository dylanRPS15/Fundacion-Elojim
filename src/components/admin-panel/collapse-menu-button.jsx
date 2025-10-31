"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

export function CollapseMenuButton({
  icon: Icon,
  label,
  active,
  submenus,
  isOpen,
  activeColor = "#2563eb", // 🔹 Color dinámico (azul por defecto)
}) {
  const pathname = usePathname();
  const isSubmenuActive = submenus.some((submenu) =>
    submenu.active === undefined ? submenu.href === pathname : submenu.active
  );
  const [isCollapsed, setIsCollapsed] = useState(isSubmenuActive);

  return isOpen ? (
    <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed} className="w-full">
      <CollapsibleTrigger
        className="[&[data-state=open]>div>div>svg]:rotate-180"
        asChild
      >
        {/* BOTÓN PRINCIPAL (Eventos, Registros, etc.) */}
        <Button
          variant="ghost"
          className="w-full justify-start h-10 mb-1 transition-colors"
          style={{
            backgroundColor: isSubmenuActive ? activeColor : "transparent",
            color: isSubmenuActive ? "white" : "inherit",
            transition: "background-color 0.2s ease, filter 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!isSubmenuActive)
              e.currentTarget.style.filter = "brightness(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1)";
          }}
        >
          <div className="w-full items-center flex justify-between">
            <div className="flex items-center">
              <span className="mr-4">
                <Icon size={18} />
              </span>
              <p
                className={cn(
                  "max-w-[150px] truncate",
                  isOpen ? "translate-x-0 opacity-100" : "-translate-x-96 opacity-0"
                )}
              >
                {label}
              </p>
            </div>
            <div
              className={cn(
                "whitespace-nowrap",
                isOpen ? "translate-x-0 opacity-100" : "-translate-x-96 opacity-0"
              )}
            >
              <ChevronDown size={18} className="transition-transform duration-200" />
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>

      {/* CONTENIDO DESPLEGABLE */}
      <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="bg-background pt-1">
          {submenus.map((submenu, index) =>
            submenu.submenus && submenu.submenus.length > 0 ? (
              <div className="ml-4" key={index}>
                <CollapseMenuButton
                  icon={Dot}
                  label={submenu.label}
                  active={submenu.active}
                  submenus={submenu.submenus}
                  isOpen={isOpen}
                  activeColor={activeColor} // 🔹 Propagar color dinámico
                />
              </div>
            ) : (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-10 mb-1 transition-colors"
                style={{
                  backgroundColor:
                    (submenu.active === undefined &&
                      pathname.startsWith(submenu.href)) ||
                    submenu.active
                      ? activeColor
                      : "transparent",
                  color:
                    (submenu.active === undefined &&
                      pathname.startsWith(submenu.href)) ||
                    submenu.active
                      ? "white"
                      : "inherit",
                  transition: "background-color 0.2s ease, filter 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (
                    !(
                      (submenu.active === undefined &&
                        pathname.startsWith(submenu.href)) ||
                      submenu.active
                    )
                  )
                    e.currentTarget.style.filter = "brightness(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "brightness(1)";
                }}
                asChild
              >
                <Link href={submenu.href}>
                  <span className="mr-4 ml-2">
                    <Dot size={18} />
                  </span>
                  <p
                    className={cn(
                      "max-w-[170px] truncate",
                      isOpen ? "translate-x-0 opacity-100" : "-translate-x-96 opacity-0"
                    )}
                  >
                    {submenu.label}
                  </p>
                </Link>
              </Button>
            )
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  ) : (
    // 🔹 MODO COMPACTO
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start h-10 mb-1 transition-colors"
                style={{
                  backgroundColor: isSubmenuActive ? activeColor : "transparent",
                  color: isSubmenuActive ? "white" : "inherit",
                }}
              >
                <div className="w-full items-center flex justify-between">
                  <div className="flex items-center">
                    <span className={cn(isOpen === false ? "" : "mr-4")}>
                      <Icon size={18} />
                    </span>
                    <p
                      className={cn(
                        "max-w-[200px] truncate",
                        isOpen === false ? "opacity-0" : "opacity-100"
                      )}
                    >
                      {label}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" alignOffset={2}>
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent side="right" sideOffset={25} align="start">
        <DropdownMenuLabel className="max-w-[190px] truncate">{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {submenus.map(({ href, label, active }, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link
              className={`cursor-pointer ${
                ((active === undefined && pathname === href) || active) && "bg-secondary"
              }`}
              href={href}
            >
              <p className="max-w-[180px] truncate">{label}</p>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuArrow className="fill-border" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SidebarToggle({ isOpen, setIsOpen }) {
  return (
    <div
      className={cn(
        "fixed top-16 left-[calc(var(--sidebar-width,72px)-12px)] z-50 transition-all duration-300",
        // Ajuste dinámico para cuando la sidebar esté abierta o cerrada
        isOpen ? "left-[calc(18rem-12px)]" : "left-[calc(5.5rem-12px)]"
      )}
    >
      <Button
        onClick={() => setIsOpen?.()}
        className="rounded-full w-9 h-9 shadow-md bg-white border hover:bg-gray-100 transition"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 text-gray-700 transition-transform ease-in-out duration-700",
            isOpen === false ? "rotate-180" : "rotate-0"
          )}
        />
      </Button>
    </div>
  );
}

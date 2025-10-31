// components/ProtectedAdmin.jsx
"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedAdmin({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === "loading") return; // Esperar a que cargue la sesión
    
    if (!session) {
      router.push("/access-denied");
    } else if (session.user.rolId !== 2) {
      router.push("/access-denied");
    }
  }, [session, status, router]);
  
  // Mostrar un indicador de carga mientras se verifica la sesión
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Solo renderiza el contenido si el usuario tiene el rol correcto
  if (session?.user?.rolId === 2) {
    return <>{children}</>;
  }
  
  // No renderizar nada mientras redirige
  return null;
}
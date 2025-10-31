"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ProgramProvider } from "@/context/ProgramContext";
import ProgramasPage from "@/components/Eventos/ProgramasPage";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function Programas() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/programas/access-denied");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) return null;

  return (
    <ProgramProvider>
      <div className="min-h-screen bg-mainBg flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20">
          <ProgramasPage />
        </main>
        <Footer />
      </div>
    </ProgramProvider>
  );
}

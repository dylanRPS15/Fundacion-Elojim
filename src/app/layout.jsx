"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/providers/theme-provider"; // 🔥
import { Toaster } from "sonner";

// Cargar las fuentes

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${inter.className} h-full`}
      suppressHydrationWarning
    >
      <body className="h-full bg-background text-foreground">
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                style: { fontFamily: "Inter, sans-serif", borderRadius: "10px" },
              }}
            />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

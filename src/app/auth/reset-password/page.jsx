"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CheckCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  useEffect(() => {
    if (!token) toast.error("Token inválido o inexistente.");
  }, [token]);

  const validations = {
    minLength: /.{8,}/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const allValid = Object.values(validations).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allValid) {
      toast.warning("Tu contraseña no cumple los requisitos mínimos.");
      return;
    }

    if (password !== confirm) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("✅ Contraseña actualizada correctamente.");
        setTimeout(() => router.push("/auth/login"), 2500);
      } else {
        toast.error(data.error || "Error al restablecer contraseña.");
      }
    } catch {
      toast.error("Error de conexión con el servidor.");
    }
    setLoading(false);
  };

  const ValidationItem = ({ label, valid }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2 text-sm"
    >
      {valid ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <Circle className="w-4 h-4 text-gray-400" />
      )}
      <span className={valid ? "text-green-600" : "text-gray-600"}>{label}</span>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-mainBg p-4">
      <Card className="w-full max-w-md bg-white shadow-lg border border-gray-100">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-[#1B3C8C]">
            Nueva Contraseña
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                type="password"
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus-visible:ring-[#1B3C8C]"
              />
            </div>

            <motion.div
              className="bg-gray-50 rounded-lg p-3 border border-gray-200 space-y-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ValidationItem
                label="Mínimo 8 caracteres"
                valid={validations.minLength}
              />
              <ValidationItem
                label="Al menos una letra mayúscula"
                valid={validations.hasUpper}
              />
              <ValidationItem
                label="Al menos un carácter especial (!, @, #, ...)"
                valid={validations.hasSpecial}
              />
            </motion.div>

            <div>
              <Input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="focus-visible:ring-[#1B3C8C]"
              />
            </div>

            <Button
              type="submit"
              className={`w-full text-white py-5 rounded-xl font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 ${
                allValid
                  ? "bg-[#1B3C8C] hover:bg-[#274fae] shadow-md hover:shadow-lg"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={loading || !allValid}
            >
              {loading ? "Guardando..." : "Actualizar contraseña"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

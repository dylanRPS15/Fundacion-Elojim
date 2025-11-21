"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Icons } from "@/components/ui/icons";
import Footer from "@/components/Footer";

const LoginPage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
      } else {
        router.push("/");
      }
    } catch (error) {
      setError("Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <>
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-[#e8ecf9] via-white to-[#f3f5fb] relative overflow-hidden px-4 md:px-10 py-10">
        {/* Círculo decorativo difuso */}
        <div className="absolute w-[600px] h-[600px] bg-[#1B3C8C]/10 rounded-full blur-3xl -top-40 -left-40"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 w-full max-w-[950px] flex flex-col md:flex-row items-center gap-10 md:gap-16 bg-white/80 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-6 md:p-10"
        >
          {/* Formulario */}
          <div className="flex-1 w-full">
            <Card className="shadow-none border-0 bg-transparent">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-3">
                  <Image
                    src="/images/logoFundación_circular.png"
                    alt="Fundación Elojim Jadach"
                    width={70}
                    height={70}
                    className="rounded-full"
                  />
                </div>
                <CardTitle className="text-2xl font-bold text-[#1B3C8C]">
                  Iniciar Sesión
                </CardTitle>
                <p className="text-gray-600 mt-1 text-sm">
                  Bienvenido de nuevo, ingresa tus credenciales.
                </p>
              </CardHeader>

              <CardContent className="p-0 space-y-4">
                {error && (
                  <Alert variant="destructive" className="mb-2">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Correo electrónico
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ejemplo@gmail.com"
                      {...register("email", {
                        required: "El correo es requerido",
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: "Correo inválido",
                        },
                      })}
                      className="mt-1 text-sm focus-visible:ring-[#1B3C8C]"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Contraseña
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        {...register("password", {
                          required: "La contraseña es requerida",
                        })}
                        className="pr-10 text-sm focus-visible:ring-[#1B3C8C]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-500 hover:text-[#1B3C8C] transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1B3C8C] hover:bg-[#274fae] text-white text-base py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      "Iniciar sesión"
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="text-center mt-3 flex flex-col gap-1 text-sm text-gray-600">
                <div>
                  ¿Olvidaste tu contraseña?{" "}
                  <Link
                    href="/auth/forgot-password"
                    className="text-[#3B82F6] hover:underline font-medium"
                  >
                    Restablecer
                  </Link>
                </div>
                <div>
                  ¿No tienes una cuenta?{" "}
                  <Link
                    href="/auth/register"
                    className="text-[#3B82F6] hover:underline font-medium"
                  >
                    Regístrate aquí
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Ilustración */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hidden md:flex flex-1 justify-center items-center relative"
          >
            <div className="absolute bg-[#1B3C8C]/10 w-[320px] h-[320px] rounded-full blur-2xl"></div>
            <Image
              src="/images/login-ilustration.png"
              alt="Ilustración inicio de sesión"
              width={360}
              height={360}
              className="object-contain relative z-10"
              priority
            />
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
};

export default LoginPage;

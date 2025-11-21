"use client";

import useRegister from "./useRegister";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/components/ui/icons";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Eye, EyeOff, CheckCircle, Circle } from "lucide-react";

const RegisterPage = () => {
  const {
    formData,
    handleChange,
    handleSubmit,
    message,
    passwordError,
    termsError,
    isLoading,
  } = useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Validaciones visuales
  const validations = {
    minLength: /.{8,}/.test(formData.password),
    hasUpper: /[A-Z]/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
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
    <>
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f7fa] via-white to-[#e0e7ff] relative overflow-hidden p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(27,60,140,0.1),_transparent_70%)] pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 w-full max-w-lg"
        >
          <Card className="bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-white/30 rounded-2xl overflow-hidden">
            <CardHeader className="text-center border-b border-gray-100 pb-6">
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/logoFundación_circular.png"
                  alt="Fundación Elojim Jadach"
                  width={90}
                  height={90}
                  className="rounded-full shadow-md"
                />
              </div>
              <CardTitle className="text-3xl font-bold text-[#1B3C8C]">
                Crear una cuenta
              </CardTitle>
              <p className="text-gray-600 mt-2 text-sm">
                Únete a la Fundación y sé parte del cambio.
              </p>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Juan"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Pérez"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="juan@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Contraseña */}
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="pr-10 focus-visible:ring-[#1B3C8C]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-[#1B3C8C]"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Validaciones dinámicas */}
                  <motion.div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mt-3 space-y-1">
                    <ValidationItem label="Mínimo 8 caracteres" valid={validations.minLength} />
                    <ValidationItem label="Al menos una letra mayúscula" valid={validations.hasUpper} />
                    <ValidationItem label="Al menos un carácter especial (!, @, #, ...)" valid={validations.hasSpecial} />
                  </motion.div>
                </div>

                {/* Confirmar contraseña */}
                <div>
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="********"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="pr-10 focus-visible:ring-[#1B3C8C]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-[#1B3C8C]"
                    >
                      {showConfirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-3">
                  <Checkbox
                    id="terms"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) =>
                      handleChange({
                        target: {
                          name: "termsAccepted",
                          type: "checkbox",
                          checked,
                        },
                      })
                    }
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-700 font-medium"
                  >
                    Acepto los{" "}
                    <Link href="#" className="text-[#3B82F6] hover:underline">
                      términos y condiciones
                    </Link>
                  </label>
                </div>

                {termsError && <p className="text-red-500 text-sm">{termsError}</p>}
                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                {message && <p className="text-center text-sm text-red-500">{message}</p>}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1B3C8C] hover:bg-[#274fae] text-white text-lg py-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    "Registrarse"
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="bg-gray-50 border-t border-gray-100 py-5 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/auth/login"
                  className="text-[#3B82F6] hover:underline font-medium"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </section>
      <Footer />
    </>
  );
};

export default RegisterPage;

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Calendar,
  MapPin,
  Clock,
  Hash,
  FileText,
  PlusCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { programs } from "@/data/programs";

export default function ModalCrearEvento({ open, onClose, onSave, programId }) {
  const { toast } = useToast();

  const program = programs.find((p) => p.id === programId); 

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    duration: "",
    capacity: "",
  });

  const handleChange = (field, value) => {
    if (field === "capacity") {
        setFormData({ ...formData, [field]: Number(value) });
    } else {
        setFormData({ ...formData, [field]: value });
    }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación ligera (similar al form original)
    if (
        !formData.title.trim() ||
        !formData.description.trim() ||
        !formData.date ||
        !formData.location.trim() ||
        !formData.duration.trim() ||
        !formData.capacity ||
        formData.capacity <= 0
    ) {
        toast({
        title: "Error al crear el evento",
        description: "Faltan datos obligatorios o datos inválidos.",
        variant: "destructive",
        });
        return;
    }

    try {
        const res = await fetch(`/api/eventos/${programId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: formData.title.trim(),
            description: formData.description.trim(),
            date: formData.date, // 🔹 no convertir, el backend ya acepta string
            location: formData.location.trim(),
            duration: formData.duration.trim(),
            capacity: formData.capacity, // 🔹 ya es number por handleChange
        }),
        });

        if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al registrar el evento");
        }

        toast({
        title: "Evento registrado correctamente",
        description: `El evento "${formData.title}" fue agregado exitosamente.`,
        });

        // Reinicia formulario
        setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        duration: "",
        capacity: "",
        });

        onSave?.();
        onClose();
    } catch (error) {
        console.error("Error al registrar evento:", error);
        toast({
        title: "Error de conexión",
        description:
            error.message || "No se pudo conectar con el servidor. Intenta nuevamente.",
        variant: "destructive",
        });
    }
    };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl relative"
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-2 mb-6">
          <PlusCircle className="w-6 h-6" style={{ color: program.color }} />
          <h2 className="text-xl font-semibold text-gray-800">
            Crear nuevo evento
          </h2>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Título del evento", icon: FileText, field: "title", type: "text" },
            { label: "Descripción", icon: FileText, field: "description", textarea: true },
          ].map(({ label, icon: Icon, field, type, textarea }) => (
            <div key={field}>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Icon className="w-4 h-4" style={{ color: program.color }} /> {label}
              </label>
              {textarea ? (
                <textarea
                  value={formData[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-opacity-50"
                  style={{
                    borderColor: program.color + "80",
                    boxShadow: `0 0 0 1px ${program.color}20`,
                  }}
                  rows={3}
                  required
                />
              ) : (
                <input
                  type={type}
                  value={formData[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-opacity-50"
                  style={{
                    borderColor: program.color + "80",
                    boxShadow: `0 0 0 1px ${program.color}20`,
                  }}
                  required
                />
              )}
            </div>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Calendar className="w-4 h-4" style={{ color: program.color }} /> Fecha y hora
              </label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm"
                style={{ borderColor: program.color + "80" }}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <MapPin className="w-4 h-4" style={{ color: program.color }} /> Ubicación
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm"
                style={{ borderColor: program.color + "80" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Clock className="w-4 h-4" style={{ color: program.color }} /> Duración
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm"
                style={{ borderColor: program.color + "80" }}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Hash className="w-4 h-4" style={{ color: program.color }} /> Capacidad máxima
              </label>
              <input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => handleChange("capacity", e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm"
                style={{ borderColor: program.color + "80" }}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:underline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="text-white px-4 py-2 rounded-lg shadow-sm transition"
              style={{
                backgroundColor: program.color,
                boxShadow: `0 4px 10px ${program.color}55`,
              }}
            >
              Guardar evento
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
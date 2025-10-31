"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Calendar,
  MapPin,
  Clock,
  Hash,
  FileText,
  ClipboardEdit,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { programs } from "@/data/programs";

export default function ModalEditEvento({
  open,
  onClose,
  evento,
  onSave,
  programId,
}) {
  const program = programs.find((p) => p.id === programId);
  const color = program?.color || "#E91E63"; // Fallback al rosa si no hay coincidencia
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    duration: "",
    capacity: "",
    registered: 0,
  });

  useEffect(() => {
    if (evento) {
      setFormData({
        title: evento.title || "",
        description: evento.description || "",
        date: evento.date
          ? new Date(evento.date).toISOString().slice(0, 16)
          : "",
        location: evento.location || "",
        duration: evento.duration || "",
        capacity: evento.capacity?.toString() || "",
        registered: evento.registered || 0,
      });
    }
  }, [evento]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const capacidad = Number(formData.capacity);
    const inscritos = Number(formData.registered);

    if (capacidad < inscritos) {
      toast({
        title: "Capacidad no válida",
        description: `La capacidad no puede ser menor que los ${inscritos} participantes inscritos.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch(`/api/eventos/${programId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: evento.id,
          ...formData,
          capacity: capacidad,
          registered: inscritos,
        }),
      });

      if (res.ok) {
        onSave();
        onClose();
        toast({
          title: "Evento actualizado correctamente",
          description: `El evento "${formData.title}" se guardó con éxito.`,
        });
      } else {
        const errorData = await res.json();
        toast({
          title: "Error al actualizar",
          description: errorData.message || "Ocurrió un error inesperado.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error al actualizar evento:", err);
      toast({
        title: "Error de conexión",
        description: "No se pudo actualizar el evento. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
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
          <ClipboardEdit className="w-6 h-6" style={{ color }} />
          <h2 className="text-xl font-semibold text-gray-800">
            Editar Evento
          </h2>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <FileText className="w-4 h-4" style={{ color }} /> Título del evento
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:border-transparent"
              style={{
                borderColor: color + "80",
                boxShadow: `0 0 0 1px ${color}20`,
                outlineColor: color,
              }}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <FileText className="w-4 h-4" style={{ color }} /> Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:border-transparent"
              style={{
                borderColor: color + "80",
                boxShadow: `0 0 0 1px ${color}20`,
              }}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Calendar className="w-4 h-4" style={{ color }} /> Fecha y hora
              </label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring-2"
                style={{ borderColor: color + "80" }}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <MapPin className="w-4 h-4" style={{ color }} /> Ubicación
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring-2"
                style={{ borderColor: color + "80" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Clock className="w-4 h-4" style={{ color }} /> Duración
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring-2"
                style={{ borderColor: color + "80" }}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Hash className="w-4 h-4" style={{ color }} /> Capacidad (máx.)
              </label>
              <input
                type="number"
                min={formData.registered}
                value={formData.capacity}
                onChange={(e) => handleChange("capacity", e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring-2"
                style={{ borderColor: color + "80" }}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Participantes inscritos actualmente:{" "}
                <span className="font-semibold">{formData.registered}</span>
              </p>
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
                backgroundColor: color,
                boxShadow: `0 4px 10px ${color}55`,
              }}
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Type, FileText, ImagePlus, SendHorizonal, XCircle } from "lucide-react";

export default function RegisterNewsPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "", images: [] });
  const [errors, setErrors] = useState({});
  const maxImages = 5;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleFileChange = (e) => {
    const newImages = Array.from(e.target.files || []);

    // Limitar a máximo 5 imágenes
    const total = [...form.images, ...newImages].slice(0, maxImages);
    setForm({ ...form, images: total });

    if (errors.images) setErrors({ ...errors, images: null });
  };

  const removeImage = (index) => {
    setForm({
      ...form,
      images: form.images.filter((_, i) => i !== index),
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "El título es obligatorio";
    if (form.images.length < 3)
      newErrors.images = "Debes subir al menos 3 imágenes";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append("title", form.title);
    data.append("content", form.content);
    form.images.forEach((img) => data.append("images", img));

    try {
      const res = await fetch("/api/news", {
        method: "POST",
        body: data,
        credentials: "include",
      });

      if (res.ok) {
        router.push("/news");
      } else {
        const err = await res.json();
        alert(err.message || "No se pudo publicar la noticia");
      }
    } catch (error) {
      console.error(error);
      alert("Error al publicar la noticia. Intenta nuevamente.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB] py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm shadow-2xl shadow-blue-100 rounded-3xl p-10 border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <ImagePlus className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Registrar Post o Noticia
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* === TÍTULO === */}
          <div>
            <label
              htmlFor="title"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
            >
              <Type className="w-4 h-4 text-blue-500" />
              Título
            </label>
            <input
              id="title"
              type="text"
              name="title"
              className={`w-full p-3 rounded-xl border ${
                errors.title ? "border-red-400" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
              value={form.title}
              onChange={handleChange}
              placeholder="Escribe el título de la noticia..."
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* === CONTENIDO === */}
          <div>
            <label
              htmlFor="content"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
            >
              <FileText className="w-4 h-4 text-blue-500" />
              Contenido
            </label>
            <textarea
              id="content"
              name="content"
              rows="6"
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={form.content}
              onChange={handleChange}
              placeholder="Describe el contenido de la noticia..."
            ></textarea>
          </div>

          {/* === IMÁGENES === */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <ImagePlus className="w-4 h-4 text-blue-500" />
              Imágenes (mínimo 3, máximo 5)
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className={`block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                file:rounded-xl file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                  errors.images ? "border border-red-400 rounded-lg" : ""
                }`}
            />

            {errors.images && (
              <p className="mt-1 text-sm text-red-500">{errors.images}</p>
            )}

            {/* PREVISUALIZACIÓN DE IMÁGENES */}
            <AnimatePresence>
              {form.images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Imágenes seleccionadas ({form.images.length}/{maxImages})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {form.images.map((img, index) => (
                      <motion.div
                        key={index}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group rounded-xl overflow-hidden shadow-md shadow-blue-100 border border-gray-200"
                      >
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`Imagen ${index + 1}`}
                          className="h-24 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* === BOTÓN DE ENVÍO === */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md shadow-blue-200 transition"
          >
            <SendHorizonal className="w-5 h-5" />
            Publicar Noticia
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

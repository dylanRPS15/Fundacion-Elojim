"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";

export default function ConfirmDeleteModal({ open, onClose, onConfirm, title }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <motion.div
          key="modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 relative"
        >
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Ícono y título */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Eliminar evento
            </h2>
            <p className="text-gray-500 mb-6">
              ¿Estás seguro de que deseas eliminar{" "}
              <span className="font-semibold text-gray-800">{title}</span>?  
              Esta acción no se puede deshacer.
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md transition"
            >
              Eliminar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

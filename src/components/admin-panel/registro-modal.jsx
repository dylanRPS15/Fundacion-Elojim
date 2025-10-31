import React, { useEffect } from "react";
import { programs } from "@/data/programs";

export default function RegistroModal({ open, onClose, record, programId = "mujer-vulnerable" }) {
  if (!open || !record) return null;

  const program = programs.find((p) => p.id === programId) || programs[0];
  const Icon = program.icon;

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (open) {
        // Bloquea el scroll global (en html y body)
        html.style.overflow = "hidden";
        body.style.overflow = "hidden";
    } else {
        // Restaura scroll al cerrar
        html.style.overflow = "auto";
        body.style.overflow = "auto";
    }

    // Limpieza en caso de desmontar el componente
    return () => {
        html.style.overflow = "auto";
        body.style.overflow = "auto";
    };
    }, [open]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-11/12 max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border border-gray-200 bg-white/95 backdrop-blur-md animate-scaleIn flex flex-col"
      >
        {/* HEADER */}
        <div
          className="flex justify-between items-center px-6 py-4 border-b border-gray-200 rounded-t-2xl"
          style={{ backgroundColor: program.bgColor }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-full shadow-md"
              style={{ backgroundColor: program.color }}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                {program.title}
              </h2>
              <p className="text-sm text-gray-600">Registro detallado del participante</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 transition text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent">
          {/* BLOQUE SUPERIOR - FICHA */}
          <div
            className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-5 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-gray-50"
            style={{ borderLeft: `6px solid ${program.color}` }}
          >
            <div
              className="flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center shadow-inner text-white text-4xl font-bold uppercase"
              style={{ backgroundColor: program.color }}
            >
              {record?.nombreCompleto?.charAt(0) || record?.nombreResponsable?.charAt(0) || "?"}
            </div>

            <div className="flex flex-col flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {record?.nombreCompleto || record?.nombreResponsable ||  "Sin nombre"}
              </h3>
              <p className="text-sm text-gray-600">
                Documento: <span className="font-medium">{record.numeroDocumento}</span>
              </p>
              <p className="text-sm text-gray-600">
                Comuna: <span className="font-medium">{record.comuna || "—"}</span> · Estrato:{" "}
                <span className="font-medium">{record.estratoSocial || "—"}</span>
              </p>
              <p className="text-sm text-gray-600">
                Grupo Étnico: <span className="font-medium">{record.grupoEtnico || "—"}</span>
              </p>
            </div>
          </div>

          {/* CAMPOS DETALLADOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(record).map(([key, value]) => (
              <div
                key={key}
                className="p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                </p>

                {Array.isArray(value) ? (
                  <div className="flex flex-wrap gap-2">
                    {value.map((item, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs rounded-full font-medium"
                        style={{
                          backgroundColor: program.bgColor,
                          color: program.color,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : typeof value === "boolean" ? (
                  <span
                    className="text-sm font-medium"
                    style={{ color: value ? "#16A34A" : "#DC2626" }}
                  >
                    {value ? "Sí" : "No"}
                  </span>
                ) : (
                  <p className="text-sm text-gray-800 break-words">
                    {value?.toString() || "—"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 flex justify-end items-center px-6 py-4 border-t border-gray-200 bg-gray-50/90 backdrop-blur-md rounded-b-2xl">
          <button
            onClick={onClose}
            className="text-white font-medium px-6 py-2.5 rounded-lg shadow-md transition"
            style={{ backgroundColor: program.color }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

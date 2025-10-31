"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Search, Pencil, Trash2 } from "lucide-react";
import ProtectedAdmin from "@/components/ProtectedAdmin";
import ParticipantesModal from "@/components/admin-panel/participantes-modal";
import ModalEditEvento from "@/components/admin-panel/modal-edit-evento";
import ConfirmDeleteModal from "@/components/admin-panel/confirm-delete-modal";
import { useToast } from "@/hooks/use-toast";
import { programs } from "@/data/programs";

export default function EventosEconomiaPlateadaPage() {
  const programId = "economia-plateada";
  const { toast } = useToast();

  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [eventoEnEdicion, setEventoEnEdicion] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    duration: "",
    capacity: "",
    registered: "",
  });

  const program = programs.find((p) => p.id === programId);
  const Icon = program.icon;

  const fetchEventos = async () => {
    try {
      const res = await fetch(`/api/eventos/${programId}`);
      if (res.ok) {
        const data = await res.json();
        const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEventos(sorted);
      } else {
        toast({ title: "Error", description: "No se pudieron obtener los eventos.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error de conexión", description: "Verifica tu red o el servidor.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const res = await fetch(`/api/eventos/${programId}?eventId=${eventId}`, { method: "DELETE" });
      if (res.ok) {
        setEventos((prev) => prev.filter((ev) => ev.id !== eventId));
        toast({ title: "Evento eliminado", description: "El evento fue eliminado correctamente." });
      } else {
        toast({ title: "Error", description: "No se pudo eliminar el evento.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Error de conexión con el servidor.", variant: "destructive" });
    }
  };

  useEffect(() => { fetchEventos(); }, []);

  useEffect(() => {
    const evtSource = new EventSource("/api/inscripciones-evento/stream");
    evtSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.programId !== programId) return;
        fetchEventos();
      } catch (err) {
        console.error("Error SSE:", err);
      }
    };
    evtSource.onerror = () => {
      evtSource.close();
      setTimeout(() => new EventSource("/api/inscripciones-evento/stream"), 5000);
    };
    return () => evtSource.close();
  }, []);

  const eventosFiltrados = eventos.filter((ev) =>
    ev.title?.toLowerCase().includes(busqueda.toLowerCase()) ||
    ev.description?.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) return <div className="p-6">Cargando eventos...</div>;

  return (
    <ProtectedAdmin>
      <ContentLayout title={`Eventos – ${program.title}`}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link href="/">Inicio</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link href="/admin">Dashboard</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Eventos {program.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Encabezado visual */}
        <motion.div
          className="mt-10 flex items-center justify-between p-6 rounded-2xl shadow-md border border-gray-200"
          style={{ backgroundColor: program.bgColor }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full shadow-sm" style={{ backgroundColor: program.color }}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {program.title} – Administración de Eventos
              </h1>
              <p className="text-sm text-gray-600">
                Gestiona los eventos, inscripciones y participantes en tiempo real.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Buscador */}
        <div className="relative max-w-md mt-10">
          <input
            type="text"
            placeholder="Buscar evento por título o descripción"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
        </div>

        {/* Tabla */}
        <motion.div
          className="mt-10 rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <table className="w-full border-collapse">
            <thead className="bg-blue-100">
              <tr className="text-gray-700 text-sm">
                {["Título", "Descripción", "Fecha", "Ubicación", "Duración", "Capacidad", "Registrados", "Acciones"].map(
                  (header) => (
                    <th key={header} className="text-left py-3 px-4 font-semibold uppercase tracking-wide border-b border-gray-200">
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {eventosFiltrados.length ? (
                eventosFiltrados.map((ev) => (
                  <tr key={ev.id} className="hover:bg-blue-50 transition text-sm border-b border-gray-100">
                    <td className="py-2 px-4 font-medium">{ev.title}</td>
                    <td className="py-2 px-4 text-gray-700">
                      {ev.description.length > 90 ? ev.description.slice(0, 90) + "..." : ev.description}
                    </td>
                    <td className="py-2 px-4 text-gray-700">
                      {new Date(ev.date).toLocaleString("es-CO", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="py-2 px-4 text-gray-700">{ev.location}</td>
                    <td className="py-2 px-4 text-gray-700">{ev.duration}</td>
                    <td className="py-2 px-4 text-gray-700">{ev.capacity}</td>
                    <td className="py-2 px-4 text-gray-700">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        {ev.registered}
                      </span>
                      <button
                        onClick={() => setEventoSeleccionado(ev.id)}
                        className="block mt-1 text-xs text-blue-600 hover:underline"
                      >
                        Ver participantes
                      </button>
                    </td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        onClick={() => {
                          setEventoEnEdicion(ev);
                          setFormData({
                            title: ev.title,
                            description: ev.description,
                            date: new Date(ev.date).toISOString().slice(0, 16),
                            location: ev.location,
                            duration: ev.duration,
                            capacity: ev.capacity?.toString(),
                          });
                        }}
                        className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setPendingDeleteId(ev.id);
                          setShowDelete(true);
                        }}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-6 italic">
                    No hay eventos que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>

        {/* Modales */}
        <ModalEditEvento
          open={!!eventoEnEdicion}
          onClose={() => setEventoEnEdicion(null)}
          evento={eventoEnEdicion}
          onSave={fetchEventos}
          programId={programId}
        />

        <ParticipantesModal
          eventoId={eventoSeleccionado}
          open={!!eventoSeleccionado}
          onClose={() => setEventoSeleccionado(null)}
        />

        <ConfirmDeleteModal
          open={showDelete}
          title="Eliminar evento"
          onClose={() => {
            setShowDelete(false);
            setPendingDeleteId(null);
          }}
          onConfirm={async () => {
            await handleDelete(pendingDeleteId);
            setShowDelete(false);
            setPendingDeleteId(null);
          }}
        />
      </ContentLayout>
    </ProtectedAdmin>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDeleteDialog } from "@/components/admin-panel/confirm-delete-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import RegistroModal from "@/components/admin-panel/registro-modal";

export default function VoluntariadoPage() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Estados para búsqueda y filtros
  const [busqueda, setBusqueda] = useState("");
  const [comuna, setComuna] = useState("");
  const [estrato, setEstrato] = useState("");
  const [grupoEtnico, setGrupoEtnico] = useState("");
  const [edadExacta, setEdadExacta] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setOpenModal(true);
  };

  const fetchRegistros = async () => {
    try {
      const res = await fetch("/api/registro/voluntariado");
      if (res.ok) {
        const data = await res.json();
        // Ordenar registros por nombre y documento (opcional)
        const sorted = data.sort((a, b) => {
          const nameCompare = a.nombreCompleto.localeCompare(b.nombreCompleto);
          if (nameCompare !== 0) return nameCompare;
          return a.numeroDocumento?.localeCompare(b.numeroDocumento || "") || 0;
        });
        setRegistros(sorted);
      } else {
        console.error("Error al obtener registros");
      }
    } catch (error) {
      console.error("Error al obtener registros", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
        try {
          const res = await fetch("/api/registro/voluntariado", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
          });
    
          if (res.ok) {
            setRegistros((prev) => prev.filter((r) => r.id !== id));
            toast({
              title: "Registro eliminado",
              description: "El registro ha sido eliminado correctamente.",
            });
          } else {
            toast({
              title: "Error al eliminar",
              description: "Hubo un problema al eliminar el registro.",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Error inesperado al eliminar el registro.",
            variant: "destructive",
          });
          console.error(error);
        }
    };

  useEffect(() => {
    fetchRegistros();
  }, []);

  // Obtener opciones únicas para filtros
  const comunas = [...new Set(registros.map((r) => r.comuna))].filter(Boolean);
  const estratos = [...new Set(registros.map((r) => r.estratoSocial))].filter(Boolean);
  const grupos = [...new Set(registros.map((r) => r.grupoEtnico))].filter(Boolean);

  // Filtrar registros según búsqueda y filtros
  const registrosFiltrados = registros.filter((registro) => {
    const matchesBusqueda =
      registro.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase()) ||
      registro.numeroDocumento?.toLowerCase().includes(busqueda.toLowerCase());

    const matchesComuna = comuna ? registro.comuna === comuna : true;
    const matchesEstrato = estrato ? registro.estratoSocial === estrato : true;
    const matchesGrupo = grupoEtnico ? registro.grupoEtnico === grupoEtnico : true;
    const matchesEdad =
      edadExacta !== "" ? registro.edad === parseInt(edadExacta) : true;

    return (
      matchesBusqueda &&
      matchesComuna &&
      matchesEstrato &&
      matchesGrupo &&
      matchesEdad
    );
  });

  if (loading) {
    return <div className="p-4">Cargando registros...</div>;
  }

  return (
    <ContentLayout title="Programa de Voluntariado Social">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Inicio</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Voluntariado</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Encabezado dinámico con color del programa */}
      {(() => {
        const program = require("@/data/programs").programs.find(
          (p) => p.id === "voluntariado"
        );
        const Icon = program.icon;

        return (
          <div
            className="mt-8 flex items-center justify-between p-6 rounded-2xl shadow-md border border-gray-200"
            style={{ backgroundColor: program.bgColor }}
          >
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-full shadow-sm"
                style={{ backgroundColor: program.color }}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {program.title}
                </h1>
                <p className="text-sm text-gray-600">
                  Gestión y administración de registros del programa
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Buscador */}
      <div className="relative max-w-md mt-8">
        <input
          type="text"
          placeholder="Buscar por nombre o documento"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm shadow-sm placeholder:text-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        </div>
      </div>

      {/* Filtros */}
      <div className="mt-10 mb-8 bg-white shadow-md rounded-xl border border-orange-400 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L14 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 018 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
          Filtros de búsqueda
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Todas las comunas</option>
            {comunas.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={estrato}
            onChange={(e) => setEstrato(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Todos los estratos</option>
            {estratos.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>

          <select
            value={grupoEtnico}
            onChange={(e) => setGrupoEtnico(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Todos los grupos étnicos</option>
            {grupos.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <input
            type="number"
            min={0}
            placeholder="Edad exacta"
            value={edadExacta}
            onChange={(e) => setEdadExacta(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Tabla de registros */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-orange-200">
            <tr className="text-gray-700 text-sm">
              {[
                "Nombre",
                "Documento",
                "Edad",
                "Comuna",
                "Estrato",
                "Grupo Étnico",
                "Acciones",
              ].map((header) => (
                <th
                  key={header}
                  className="text-left py-3 px-4 font-semibold uppercase tracking-wide border-b border-gray-200"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {registrosFiltrados.map((registro) => (
              <tr
                key={registro.id}
                className="hover:bg-gray-50 transition-all text-sm border-b border-gray-100"
              >
                <td className="py-2 px-4 font-medium text-gray-800">
                  {registro.nombreCompleto}
                </td>
                <td className="py-2 px-4 text-gray-700">
                  {registro.numeroDocumento}
                </td>
                <td className="py-2 px-4 text-gray-700">{registro.edad}</td>
                <td className="py-2 px-4 text-gray-700">{registro.comuna}</td>
                <td className="py-2 px-4 text-gray-700">
                  {registro.estratoSocial}
                </td>
                <td className="py-2 px-4">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
                    {registro.grupoEtnico}
                  </span>
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    onClick={() => handleViewRecord(registro)}
                    className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.639 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Ver
                  </button>
                  <ConfirmDeleteDialog
                    onConfirm={() => handleDelete(registro.id)}
                  />
                </td>
              </tr>
            ))}

            {registrosFiltrados.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center text-gray-500 py-6 text-sm italic"
                >
                  No hay registros que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
    {/* Modal */}
    <RegistroModal
      open={openModal}
      onClose={() => setOpenModal(false)}
      record={selectedRecord}
      programId="voluntariado"
    />
    </ContentLayout>
  );
}

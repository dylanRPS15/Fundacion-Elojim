"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

const ProgramContext = createContext(undefined);

/** Endpoints estáticos por programa para REGISTRO (inscripción al programa) */
const registroEndpoints = {
  "mujer-vulnerable": "/api/registro/mujer-vulnerable",
  "semillero-innovacion": "/api/registro/semillero-innovacion",
  "seguridad-alimentaria": "/api/registro/seguridad-alimentaria",
  "voluntariado": "/api/registro/voluntariado",
  "economia-plateada": "/api/registro/economia-plateada",
  "cultural": "/api/registro/cultural",
  "taller-steam": "/api/registro/taller-steam",
  "refuerzo-escolar": "/api/registro/refuerzo-escolar",
  "software-factory": "/api/registro/software-factory",
};

/** Eventos por programa (dinámica) => /api/eventos/[programId] */
const eventosEndpoint = (programId) => `/api/eventos/${programId}`;

/** Inscripciones por evento */
const inscripcionesEventoBase = "/api/inscripciones-evento";
const inscripcionesEventoByEvent = (eventoId) => `/api/inscripciones-evento/${eventoId}`;

export function ProgramProvider({ children }) {
  const { data: session } = useSession();

  /** Programas en los que el usuario está inscrito (por slug) */
  const [userPrograms, setUserPrograms] = useState([]);
  /** Identidad del usuario por programa (para cruzar con inscripciones de eventos) */
  const [userIdentityByProgram, setUserIdentityByProgram] = useState(
    /** { [programId]: { numeroDocumento?: string, nombreCompleto?: string, email?: string } } */
    {}
  );
  /** Cache de si estoy inscrito a un evento: { [eventId]: { ok: boolean, inscripcionId?: number } } */
  const [eventRegistrations, setEventRegistrations] = useState({});
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  /** Limpia todo cuando no hay sesión */
  useEffect(() => {
    if (!session?.user?.id) {
      setUserPrograms([]);
      setUserIdentityByProgram({});
      setEventRegistrations({});
      setLoadingPrograms(false);
    }
  }, [session?.user?.id]);

  /** Obtiene TODOS los registros de un programa y devuelve el del usuario actual (o null) */
  const getMyRegistroForProgram = useCallback(
    async (programId) => {
      const ep = registroEndpoints[programId];
      if (!ep || !session?.user?.id) return null;

      const res = await fetch(ep, { cache: "no-store" });
      if (!res.ok) return null;

      const all = await res.json();
      // Algunas tablas guardan 'usuarioId', otras podrían usar 'userId'. Cubrimos ambos.
      const uid = Number(session.user.id);
      const mine =
        all.find((r) => Number(r.usuarioId) === uid) ??
        all.find((r) => Number(r.userId) === uid) ??
        null;
      return mine || null;
    },
    [session?.user?.id]
  );

  /** Refresca programas inscritos e identidad por programa (doc/email/nombre) */
  const refreshPrograms = useCallback(async () => {
    if (!session?.user?.id) {
      setUserPrograms([]);
      setUserIdentityByProgram({});
      setLoadingPrograms(false);
      return;
    }

    setLoadingPrograms(true);
    try {
      const newPrograms = [];
      const identity = {};
      for (const programId of Object.keys(registroEndpoints)) {
        try {
          const mine = await getMyRegistroForProgram(programId);
          if (mine) {
            newPrograms.push(programId);
            identity[programId] = {
              numeroDocumento: mine.numeroDocumento || mine.numeroDoc || undefined,
              nombreCompleto: mine.nombreCompleto || mine.nombreResponsable || undefined,
              email: mine.correoElectronico || mine.email || undefined,
            };
          }
        } catch {}
      }
      setUserPrograms(newPrograms);
      setUserIdentityByProgram(identity);
    } finally {
      setLoadingPrograms(false);
    }
  }, [getMyRegistroForProgram, session?.user?.id]);
  /** Carga inicial y al cambiar usuario */
  useEffect(() => {
    if (session?.user?.id) {
      refreshPrograms();
    }
  }, [refreshPrograms, session?.user?.id]);

  // 🟢 Escuchar actualizaciones SSE del backend
  useEffect(() => {
    const evtSource = new EventSource("/api/registro/stream");

    evtSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { action, programId, userId } = data;

        if (!programId || !userId) return;

        if (userId === Number(session?.user?.id)) {
          if (action === "created") {
            setUserPrograms((prev) =>
              prev.includes(programId) ? prev : [...prev, programId]
            );
          } else if (action === "deleted") {
            setUserPrograms((prev) => prev.filter((p) => p !== programId));
          }
        }
      } catch (err) {
        console.error("Error SSE:", err);
      }
    };

    evtSource.onerror = (err) => {
      console.warn("SSE connection lost, reconnecting...", err);
      evtSource.close();
      setTimeout(() => {
        new EventSource("/api/registro/stream");
      }, 5000);
    };

    return () => evtSource.close();
  }, [session?.user?.id]);

  /** Helpers de Programa */
  const isRegistered = (programId) => userPrograms.includes(programId);

  const registerProgram = (programId) => {
    setUserPrograms((prev) => {
      if (prev.includes(programId)) return prev;
      return [...prev, programId];
    });
  };

  /** Para desinscribir del programa: necesitas el ID del registro en esa tabla */
  const unregisterProgram = async (programId, registroId) => {
    const ep = registroEndpoints[programId];
    if (!ep) throw new Error(`No existe endpoint de registro para "${programId}"`);
    const res = await fetch(ep, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Number(registroId) }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(t || "Error al eliminar inscripción de programa");
    }

    await refreshPrograms();
    return true;
  };

  /** --- EVENTOS --- */

  /** Dado un evento, trae sus inscripciones y determina si el usuario actual está inscrito. */
  const resolveEventRegistration = useCallback(
    async (eventId, programId) => {
      if (!eventId) return { ok: false };

      // Si ya lo tenemos cacheado, retorna
      const cached = eventRegistrations[eventId];
      if (cached) return cached;

      // Necesitamos un identificador: idealmente Numero de documento del usuario en ese programa
      const ident = userIdentityByProgram[programId];
      // Si el usuario no está inscrito al programa o no tenemos documento, no está inscrito al evento
      if (!ident || !ident.numeroDocumento) {
        setEventRegistrations((prev) => ({ ...prev, [eventId]: { ok: false } }));
        return { ok: false };
      }

      const res = await fetch(inscripcionesEventoByEvent(eventId), { cache: "no-store" });
      if (!res.ok) {
        setEventRegistrations((prev) => ({ ...prev, [eventId]: { ok: false } }));
        return { ok: false };
      }

      const lista = await res.json(); // array de inscripciones del evento
      // Coincidimos por numeroDocumento (tu tabla inscripciones_por_evento guarda ese campo)
      const mine = Array.isArray(lista)
        ? lista.find((i) => String(i.numeroDocumento) === String(ident.numeroDocumento))
        : null;

      const value = mine ? { ok: true, inscripcionId: Number(mine.id) } : { ok: false };
      setEventRegistrations((prev) => ({ ...prev, [eventId]: value }));
      return value;
    },
    [eventRegistrations, userIdentityByProgram]
  );


  /** Refresca UN evento (ideal para EventsList al montarse) */
  const refreshEventFor = async (programId, eventId) => {
    await resolveEventRegistration(eventId, programId);
  };


  /** Para usar fácil en la UI */
  const isEventRegistered = useCallback(
    (eventId, programId) => {
      const cached = eventRegistrations[eventId];
      if (cached) return !!cached.ok;

      // Si no está en cache, refrescamos desde DB de forma asíncrona
      refreshEventFor(programId, eventId);
      return false;
    },
    [eventRegistrations, refreshEventFor]
  );



  useEffect(() => {
    const evtSource = new EventSource("/api/inscripciones-evento/stream");

    evtSource.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        const { action, eventoId, programId, inscripcionId, userId } = data;
        if (!eventoId || !programId) return;

        setEventRegistrations((prev) => {
          const next = { ...prev };
          const current = prev[eventoId];

          // 🟢 Sólo marcar "Inscrito" si el SSE pertenece al usuario actual
          if (action === "created" && inscripcionId && userId === Number(session?.user?.id)) {
            next[eventoId] = { ok: true, inscripcionId };
          }

        
          if (action === "deleted") {
            if (current?.inscripcionId === inscripcionId) {
              next[eventoId] = { ok: false };
            } else {
              setTimeout(() => {
                refreshEventFor(programId, eventoId);
              }, 0);
            }
          }

          return next;
        });
      } catch (err) {
        console.error("Error SSE eventos:", err);
      }
    };

    evtSource.onerror = (err) => {
      console.warn("SSE desconectado. Reintentando...", err);
      evtSource.close();
      setTimeout(() => new EventSource("/api/inscripciones-evento/stream"), 5000);
    };

    return () => evtSource.close();
  }, [session?.user?.id, refreshEventFor]);

  /** Registrar en evento (POST global a /api/inscripciones-evento) */
  const registerEvent = async (programId, eventId) => {
    const res = await fetch(inscripcionesEventoBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // El backend toma user de la sesión y arma nombre/documento desde el registro del programa
      body: JSON.stringify({ programId, eventoId: Number(eventId) }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(t || "Error al inscribirse al evento");
    }

    // ✅ Leer la respuesta JSON y obtener el inscripcionId (lo agregamos en el backend si no está)
    const data = await res.json();
    const inscripcionId = data?.id || data?.inscripcionId || Date.now(); // fallback temporal

    setEventRegistrations((prev) => ({
      ...prev,
      [eventId]: { ok: true, inscripcionId },
    }));

    // Revalidamos ese evento
    await resolveEventRegistration(eventId, programId);
    return true;
  };

  /** Desinscribir de evento: necesitamos el id de inscripción (lo resolvemos si no está en cache) */
  const unregisterEvent = async (programId, eventId) => {
    let inscId = eventRegistrations[eventId]?.inscripcionId;

    if (!inscId) {
      const res = await fetch(inscripcionesEventoByEvent(eventId), { cache: "no-store" });
      if (res.ok) {
        const lista = await res.json();
        const ident = userIdentityByProgram[programId];
        if (ident?.numeroDocumento) {
          const mine = Array.isArray(lista)
            ? lista.find((i) => String(i.numeroDocumento) === String(ident.numeroDocumento))
            : null;
          inscId = mine?.id ? Number(mine.id) : undefined;
        }
      }
    }

    if (!inscId) throw new Error("No se encontró la inscripción del usuario para este evento");

    const res = await fetch(inscripcionesEventoByEvent(eventId), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Number(inscId) }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(t || "Error al eliminar inscripción del evento");
    }

    setEventRegistrations((prev) => ({ ...prev, [eventId]: { ok: false } }));
    return true;
    };

    

  return (
    <ProgramContext.Provider
      value={{
        /** PROGRAMAS */
        userPrograms,
        isRegistered,
        registerProgram,
        unregisterProgram,
        refreshPrograms,

        /** EVENTOS */
        isEventRegistered,
        registerEvent,
        unregisterEvent,
        refreshEventFor,

        /** Opcional: acceso a identidad por programa (por si lo necesitas en UI) */
        userIdentityByProgram,
        loadingPrograms,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
}

export const usePrograms = () => {
  const ctx = useContext(ProgramContext);
  if (!ctx) throw new Error("usePrograms must be used within a ProgramProvider");
  return ctx;
};

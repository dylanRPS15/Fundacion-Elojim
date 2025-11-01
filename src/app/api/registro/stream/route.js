export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";

// 🧩 Usamos un globalThis compartido para evitar duplicaciones en hot-reload
if (!globalThis.__SSE_CLIENTS__) {
  globalThis.__SSE_CLIENTS__ = [];
}
const clients = globalThis.__SSE_CLIENTS__;

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();  
      const client = { controller, encoder, isClosed: false };
      clients.push(client);

      // 🔹 Primer mensaje (handshake)
      try {
        controller.enqueue(encoder.encode("event: connected\ndata: ok\n\n"));
      } catch {}

      // 🔹 Keep-alive cada 15 s
      const keepAlive = setInterval(() => {
        if (client.isClosed) return;
        try {
          controller.enqueue(encoder.encode(":\n\n"));
        } catch {
          client.isClosed = true;
          clearInterval(keepAlive);
        }
      }, 15000);

      // 🔹 Limpiar si el navegador cierra la conexión
      controller.signal?.addEventListener?.("abort", () => {
        client.isClosed = true;
        clearInterval(keepAlive);
      });
    },
    cancel() {
      // Si se cancela el stream, eliminamos clientes cerrados
      for (let i = clients.length - 1; i >= 0; i--) {
        if (clients[i].isClosed) clients.splice(i, 1);
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// 🔹 Función para emitir mensajes SSE de manera segura
export function sendRegistroUpdate(data) {
  const message = `data: ${JSON.stringify(data)}\n\n`;

  for (let i = clients.length - 1; i >= 0; i--) {
    const client = clients[i];
    if (client.isClosed) {
      clients.splice(i, 1);
      continue;
    }
    try {
      client.controller.enqueue(client.encoder.encode(message));
    } catch {
      client.isClosed = true;
      clients.splice(i, 1);
    }
  }
}

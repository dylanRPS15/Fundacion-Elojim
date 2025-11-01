export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from "next/server";

if (!globalThis.__SSE_EVENT_CLIENTS__) {
  globalThis.__SSE_EVENT_CLIENTS__ = [];
}
const clients = globalThis.__SSE_EVENT_CLIENTS__;

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const client = { controller, encoder, closed: false };
      clients.push(client);

      const keepAlive = setInterval(() => {
        if (client.closed) return clearInterval(keepAlive);
        try {
          controller.enqueue(encoder.encode(":\n\n"));
        } catch {
          client.closed = true;
          clearInterval(keepAlive);
        }
      }, 15000);
    },
    cancel() {
      for (let i = clients.length - 1; i >= 0; i--) {
        if (clients[i].closed) clients.splice(i, 1);
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

export function sendEventoUpdate(data) {
  const message = `data: ${JSON.stringify(data)}\n\n`;

  for (let i = clients.length - 1; i >= 0; i--) {
    const client = clients[i];
    if (client.closed) {
      clients.splice(i, 1);
      continue;
    }
    try {
      client.controller.enqueue(client.encoder.encode(message));
    } catch {
      client.closed = true;
      clients.splice(i, 1);
    }
  }
}

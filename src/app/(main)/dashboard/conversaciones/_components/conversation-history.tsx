"use client";

import { Briefcase, MapPin, Share2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { type Conversation } from "../types";

interface ConversationHistoryProps {
  conversation: Conversation;
}

export function ConversationHistory({ conversation }: ConversationHistoryProps) {
  return (
    <>
      <div className="bg-background/50 flex flex-wrap items-center gap-2 rounded-lg border p-3">
        {conversation.platform_source ? (
          <>
            <div className="flex items-center gap-2">
              <Share2 className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-semibold">Fuente:</span>
              <Badge variant="secondary">{conversation.platform_source}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-semibold">Nicho:</span>
              <Badge variant="secondary">{conversation.nicho_busqueda}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-semibold">Ubicación:</span>
              <Badge variant="secondary">{conversation.ubicacion_busqueda}</Badge>
            </div>
          </>
        ) : (
          <Badge className="border-green-600 bg-green-50 text-green-700">Orgánico</Badge>
        )}
      </div>
      <ScrollArea className="h-[500px] w-full rounded-md border p-4">
        <div className="space-y-4">
          {conversation.mensajes.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm break-words",
                message.emisor === "cliente" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted",
              )}
            >
              <span className="font-bold">{message.emisor === "cliente" ? conversation.nombre : "Agente"}</span>
              {message.contenido}
              <span
                className={cn(
                  "self-end text-xs",
                  message.emisor === "cliente" ? "text-primary-foreground/70" : "text-muted-foreground",
                )}
              >
                {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}

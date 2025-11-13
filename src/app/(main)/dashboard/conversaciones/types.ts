export interface Message {
  id: string;
  contenido: string;
  emisor: "cliente" | "agente";
  timestamp: string;
}

export interface Conversation {
  id: string;
  nombre: string;
  mensajes: Message[];
  ubicacion_busqueda?: string;
  nicho_busqueda?: string;
  platform_source?: string;
}

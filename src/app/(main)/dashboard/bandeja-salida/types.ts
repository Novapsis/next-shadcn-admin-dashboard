export interface EmailEntry {
  id: string;
  nombre_empresa: string;
  scraped_email: string;
  asunto_final: string;
  estado_envio: string;
  fecha_creacion: string;
}

export interface FullEmailEntry extends EmailEntry {
  cuerpo_html_final: string;
}

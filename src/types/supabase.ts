export interface Lead {
  lead_id: string;
  timestamp_registro: string;
  nombre_empresa: string | null;
  email: string | null;
  website_inicial: string | null;
  pais: string | null;
  idioma: string | null;
  direccion: string | null;
  formatted_phone_number: string | null;
  international_phone_number: string | null;
  type: string | null;
  rating_google: number | null;
  total_reviews: number | null;
  logo_url: string | null;
  logo_color: string | null;
  email_title: string | null;
  email_body: string | null;
  status: string | null;
  fecha_envio: string | null;
  fecha_respuesta: string | null;
  quality_score: number | null;
  approval_status: string | null;
  review_notes: string | null;
  comando_aprobacion: string | null;
}

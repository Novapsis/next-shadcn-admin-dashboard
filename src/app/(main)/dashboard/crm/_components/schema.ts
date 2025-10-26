import z from "zod";

export const leadSchema = z.object({
  lead_id: z.string(),
  nombre_empresa: z.string().nullable(),
  email: z.string().email().nullable(),
  status: z.string().nullable(),
  timestamp_registro: z.string(),
  pais: z.string().nullable(),
});

"use server";

import { cookies } from "next/headers";

import { type Conversation } from "@/app/(main)/dashboard/conversaciones/types";
import { supabase } from "@/lib/supabase";

export async function getValueFromCookie(key: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
}

export async function setValueToCookie(
  key: string,
  value: string,
  options: { path?: string; maxAge?: number } = {},
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(key, value, {
    path: options.path ?? "/",
    maxAge: options.maxAge ?? 60 * 60 * 24 * 7, // default: 7 days
  });
}

export async function getPreference<T extends string>(key: string, allowed: readonly T[], fallback: T): Promise<T> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(key);
  const value = cookie ? cookie.value.trim() : undefined;
  return allowed.includes(value as T) ? (value as T) : fallback;
}

// eslint-disable-next-line complexity
export async function getDashboardStats() {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  const tomorrowStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

  const promises = [
    supabase.from("leads").select("*", { count: "exact", head: true }), // Total Leads
    supabase.from("leads").select("*", { count: "exact", head: true }).not("fecha_envio", "is", null), // Contacted Leads
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("timestamp_registro", todayStart)
      .lt("timestamp_registro", tomorrowStart), // Today's Leads
    supabase.from("leads").select("status").in("status", ["whatsapp", "instagram", "linkedin", "X", "Facebook"]), // Leads by Channel
    supabase.from("leads").select("fecha_envio, fecha_respuesta").not("fecha_envio", "is", null), // Efficiency
  ];

  const [
    { count: totalLeads },
    { count: contactedLeads },
    { count: todaysLeads },
    { data: leadsByChannelData, error: leadsByChannelError },
    { data: efficiencyData, error: efficiencyError },
  ] = await Promise.all(promises);

  if (leadsByChannelError ?? efficiencyError) {
    console.error("Error fetching dashboard stats:", leadsByChannelError ?? efficiencyError);
  }

  const leadsByChannel = leadsByChannelData
    ? leadsByChannelData.reduce((acc: { [key: string]: number }, { status }) => {
        if (status) {
          // eslint-disable-next-line security/detect-object-injection
          acc[status] = (acc[status] ?? 0) + 1;
        }
        return acc;
      }, {})
    : {};

  let efficiency = 0;
  if (efficiencyData) {
    const respondedCount = efficiencyData.filter((lead) => lead.fecha_respuesta !== null).length;
    const contactedCount = efficiencyData.length;
    efficiency = contactedCount > 0 ? (respondedCount / contactedCount) * 100 : 0;
  }

  const ninetyDaysAgo = new Date(today);
  ninetyDaysAgo.setDate(today.getDate() - 89);
  ninetyDaysAgo.setHours(0, 0, 0, 0);

  const { data: rangeData, error: rangeError } = await supabase
    .from("leads")
    .select("timestamp_registro")
    .gte("timestamp_registro", ninetyDaysAgo.toISOString())
    .lte("timestamp_registro", today.toISOString());

  if (rangeError) {
    console.error(`Error fetching leads for time series:`, rangeError);
  }

  const leadsByDay: { [key: string]: number } = {};
  for (let i = 0; i < 90; i++) {
    const d = new Date(ninetyDaysAgo);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split("T")[0]; // YYYY-MM-DD
    leadsByDay[key] = 0;
  }

  if (rangeData) {
    for (const item of rangeData) {
      const key = (item.timestamp_registro as string).split("T")[0];
      if (Object.prototype.hasOwnProperty.call(leadsByDay, key)) {
        // eslint-disable-next-line security/detect-object-injection
        leadsByDay[key]++;
      }
    }
  }

  const leadsTimeSeries = Object.entries(leadsByDay).map(([date, count]) => ({
    date: date,
    leads: count,
  }));

  const result = {
    totalLeads: totalLeads ?? 0,
    contactedLeads: contactedLeads ?? 0,
    todaysLeads: todaysLeads ?? 0,
    leadsByChannel,
    efficiency: efficiency,
    leadsTimeSeries, // Changed from weeklyLeads
  };

  console.log("Dashboard Stats:", result);

  return result;
}

export async function getLeads() {
  const { data: leads, error } = await supabase.from("leads").select("*");

  if (error) {
    console.error("Error fetching leads:", error);
    return [];
  }

  console.log("Fetched Leads Count:", leads.length);

  return leads;
}

export async function getSentEmails() {
  const { data: emails, error } = await supabase
    .from("envios_email")
    .select("*")
    .order("fecha_creacion", { ascending: false });

  if (error) {
    console.error("Error fetching sent emails:", error);
    return [];
  }

  return emails;
}

export async function getConversations(): Promise<Conversation[]> {
  const { data, error } = await supabase.from("clientes").select(`
      id,
      nombre,
      leads:leads!source_lead_id (
        status,
        nicho_busqueda,
        ubicacion_busqueda,
        platform_source
      ),
      mensajes (
        id,
        contenido,
        emisor,
        timestamp
      )
    `);

  if (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }

  const conversations: Conversation[] = data.map((cliente: any) => ({
    id: cliente.id,
    nombre: cliente.nombre,
    mensajes: cliente.mensajes ?? [],
    // The lead data is nested inside the 'leads' property
    ubicacion_busqueda: cliente.leads?.ubicacion_busqueda,
    nicho_busqueda: cliente.leads?.nicho_busqueda,
    platform_source: cliente.leads?.platform_source ?? cliente.leads?.status,
  }));

  return conversations;
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  const { data: clienteData, error: clienteError } = await supabase
    .from("clientes")
    .select(
      `
      id,
      nombre,
      leads:leads!source_lead_id (
        status,
        nicho_busqueda,
        ubicacion_busqueda,
        platform_source
      ),
      mensajes (
        id,
        contenido,
        emisor,
        timestamp
      )
    `,
    )
    .eq("id", id)
    .single();

  if (clienteError) {
    console.error(`Error fetching cliente/conversation with ID ${id}:`, clienteError);
    return null;
  }

  if (!clienteData) {
    return null;
  }

  const conversation: Conversation = {
    id: clienteData.id,
    nombre: clienteData.nombre,
    mensajes: clienteData.mensajes ?? [],
    ubicacion_busqueda: clienteData.leads?.ubicacion_busqueda,
    nicho_busqueda: clienteData.leads?.nicho_busqueda,
    platform_source: clienteData.leads?.platform_source ?? clienteData.leads?.status,
  };

  return conversation;
}

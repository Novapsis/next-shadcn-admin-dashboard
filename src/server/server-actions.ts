"use server";

import { cookies } from "next/headers";

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
export async function getDashboardStats(timeRange: string = "90d") {
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
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, security/detect-object-injection
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

  const startDate = new Date(today);
  let daysToSubtract = 90;
  if (timeRange === "30d") {
    daysToSubtract = 30;
  } else if (timeRange === "7d") {
    daysToSubtract = 7;
  }
  startDate.setDate(today.getDate() - (daysToSubtract - 1));
  startDate.setHours(0, 0, 0, 0); // Start of the period

  const { data: rangeData, error: rangeError } = await supabase
    .from("leads")
    .select("timestamp_registro")
    .gte("timestamp_registro", startDate.toISOString())
    .lte("timestamp_registro", today.toISOString());

  if (rangeError) {
    console.error(`Error fetching leads for time range ${timeRange}:`, rangeError);
  }

  // --- New logic for data aggregation ---
  const leadsByDay: { [key: string]: number } = {};
  // Initialize all days in the range to 0
  for (let i = 0; i < daysToSubtract; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const key = d.toISOString().split("T")[0]; // YYYY-MM-DD
    // eslint-disable-next-line security/detect-object-injection
    leadsByDay[key] = 0;
  }

  if (rangeData) {
    for (const item of rangeData) {
      const key = (item.timestamp_registro as string).split("T")[0]; // YYYY-MM-DD
      if (Object.prototype.hasOwnProperty.call(leadsByDay, key)) {
        // eslint-disable-next-line security/detect-object-injection
        leadsByDay[key]++;
      }
    }
  }

  const weeklyLeads = Object.entries(leadsByDay).map(([date, count]) => ({
    day: date, // The client will format this
    value: count,
  }));

  const result = {
    totalLeads: totalLeads ?? 0,
    contactedLeads: contactedLeads ?? 0,
    todaysLeads: todaysLeads ?? 0,
    leadsByChannel,
    efficiency: efficiency,
    weeklyLeads,
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

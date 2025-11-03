"use server";

import { revalidatePath } from "next/cache";

import { supabase } from "@/lib/supabase";

export async function getAutomationState(id: string): Promise<boolean> {
  const { data, error } = await supabase.from("automation_states").select("is_active").eq("id", id).single();

  if (error) {
    console.error("Error getting automation state:", error);
    return false;
  }

  return data?.is_active ?? false;
}

export async function updateAutomationState(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase.from("automation_states").update({ is_active: isActive }).eq("id", id);

  if (error) {
    console.error("Error updating automation state:", error);
  } else {
    revalidatePath("/dashboard/automatizacion");
  }
}

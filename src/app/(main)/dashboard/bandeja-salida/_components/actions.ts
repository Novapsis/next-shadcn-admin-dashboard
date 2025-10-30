"use server";

import { revalidatePath } from "next/cache";

import { supabase } from "@/lib/supabase";

export async function approveEmail(emailId: string) {
  console.log(`Approving email with ID: ${emailId}`);

  const { data, error } = await supabase
    .from("envios_email")
    .update({ estado_envio: "enviar" })
    .eq("id", emailId)
    .select();

  if (error) {
    console.error("Error updating email status:", error);
    return {
      success: false,
      message: "Error al actualizar el estado del email.",
    };
  }

  console.log("Email status updated successfully:", data);

  // Revalidate the path to refresh the data in the table
  revalidatePath("/dashboard/bandeja-salida");

  return {
    success: true,
    message: "Email aprobado y marcado para envío.",
  };
}

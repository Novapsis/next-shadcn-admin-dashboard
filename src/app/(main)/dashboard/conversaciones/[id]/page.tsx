import { Suspense } from "react";

import { notFound } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { getConversationById } from "@/server/server-actions"; // Assuming this function exists or will be created

import { ConversationHistory } from "../_components/conversation-history"; // Reusing the modal's content component

interface ConversationPageProps {
  params: {
    id: string;
  };
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const conversation = await getConversationById(params.id);

  if (!conversation) {
    notFound();
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-4 text-2xl font-bold">Historial de Conversación</h1>
      <Suspense fallback={<Skeleton className="h-[400px]" />}>
        <ConversationHistory conversation={conversation} />
      </Suspense>
    </div>
  );
}

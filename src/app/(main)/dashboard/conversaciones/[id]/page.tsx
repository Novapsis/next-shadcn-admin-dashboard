import { Suspense } from "react";

import { notFound } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { getConversationById } from "@/server/server-actions";

import { ConversationHistory } from "../_components/conversation-history";

interface ConversationPageProps {
  params: {
    id: string;
  };
}

// In Next.js 16+, the `params` object for async pages is a Promise.
// It must be awaited before its properties can be accessed.
export default async function ConversationPage({
  params: paramsPromise,
}: {
  params: Promise<ConversationPageProps["params"]>;
}) {
  const params = await paramsPromise;
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

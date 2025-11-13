import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getConversations } from "@/server/server-actions";

import { ConversationsTable } from "./_components/conversations-table";

export default async function ConversationsPage() {
  const conversations = await getConversations();

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-4 text-2xl font-bold">Conversaciones</h1>
      <Suspense fallback={<Skeleton className="h-[400px]" />}>
        <ConversationsTable data={conversations ?? []} />
      </Suspense>
    </div>
  );
}

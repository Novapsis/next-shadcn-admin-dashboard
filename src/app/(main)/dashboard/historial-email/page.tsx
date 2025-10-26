import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getSentEmails } from "@/server/server-actions";

import { SentEmailsTable } from "./_components/sent-emails-table";

export default async function EmailHistoryPage() {
  const emails = await getSentEmails();

  // We need to ensure the data matches the type expected by the table
  const typedEmails = emails as {
    id: string;
    scraped_email: string;
    asunto_final: string;
    cuerpo_html_final: string;
    fecha_creacion: string;
  }[];

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Historial de Envíos</CardTitle>
          <CardDescription>Aquí puedes ver todos los correos electrónicos enviados desde el sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <SentEmailsTable emails={typedEmails} />
        </CardContent>
      </Card>
    </div>
  );
}

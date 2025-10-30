import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { EmailAutomationButton } from "./_components/email-automation-button";
import { InstagramLeadAutomationButton } from "./_components/instagram-lead-automation-button";
import { InstagramMessageAutomationButton } from "./_components/instagram-message-automation-button";
import { LeadSearchAutomationButton } from "./_components/lead-search-automation-button";
import { InstagramScrapingButton } from "./_components/manual-lead-search-button";

export default function AutomationPage() {
  return (
    <div className="container mx-auto flex flex-col gap-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Automatización de Correos</CardTitle>
          <CardDescription>Activa o desactiva la redacción automática de correos electrónicos.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmailAutomationButton />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automatización de Búsqueda de Leads</CardTitle>
          <CardDescription>Activa o desactiva la búsqueda y registro automático de nuevos leads.</CardDescription>
        </CardHeader>
        <CardContent>
          <LeadSearchAutomationButton />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Búsqueda Manual de Leads</CardTitle>
          <CardDescription>Inicia una búsqueda manual de leads a través de Instagram.</CardDescription>
        </CardHeader>
        <CardContent>
          <InstagramScrapingButton />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automatización de Leads de Instagram</CardTitle>
          <CardDescription>Activa o desactiva la obtención automática de leads desde Instagram.</CardDescription>
        </CardHeader>
        <CardContent>
          <InstagramLeadAutomationButton />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automatización de Mensajes de Instagram</CardTitle>
          <CardDescription>
            Activa o desactiva el envío automático de mensajes a nuevos seguidores de Instagram.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InstagramMessageAutomationButton />
        </CardContent>
      </Card>
    </div>
  );
}

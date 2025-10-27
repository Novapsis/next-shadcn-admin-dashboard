import { getDashboardStats, getLeads } from "@/server/server-actions";

import { InsightCards } from "./_components/insight-cards";
import { OperationalCards } from "./_components/operational-cards";
import { OverviewCards } from "./_components/overview-cards";
import { TableCards } from "./_components/table-cards";
import { WeeklyLeadsCard } from "./_components/weekly-leads-card";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [stats, leads] = await Promise.all([getDashboardStats(), getLeads()]);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <OverviewCards
        totalLeads={stats.totalLeads}
        contactedLeads={stats.contactedLeads}
        todaysLeads={stats.todaysLeads}
        efficiency={stats.efficiency}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <InsightCards leadsByChannel={stats.leadsByChannel} />
        <WeeklyLeadsCard leadsTimeSeries={stats.leadsTimeSeries} />
      </div>
      <OperationalCards />
      <TableCards leads={leads} />
    </div>
  );
}

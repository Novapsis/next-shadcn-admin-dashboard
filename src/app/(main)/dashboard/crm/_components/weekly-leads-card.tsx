"use client";

import * as React from "react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

// The raw data prop from the server
interface WeeklyLeadsCardProps {
  leadsTimeSeries: { date: string; leads: number }[];
}

const chartConfig = {
  leads: {
    label: "Leads",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function WeeklyLeadsCard({ leadsTimeSeries }: WeeklyLeadsCardProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  // Set default time range for mobile
  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // eslint-disable-next-line complexity
  const { data, description } = React.useMemo(() => {
    const now = new Date();
    let data: { day: string; value: number }[] = [];
    let description = "";

    switch (timeRange) {
      case "1d": {
        description = "Últimas 24 horas";
        const yesterday = new Date();
        yesterday.setHours(now.getHours() - 23, 0, 0, 0);
        const todaysData = leadsTimeSeries.filter((item) => new Date(item.date) >= yesterday);

        const leadsByHourChunk: { [key: string]: number } = {
          "00-03": 0,
          "03-06": 0,
          "06-09": 0,
          "09-12": 0,
          "12-15": 0,
          "15-18": 0,
          "18-21": 0,
          "21-24": 0,
        };

        for (const item of todaysData) {
          const hour = new Date(item.date).getHours();
          if (hour < 3) leadsByHourChunk["00-03"] += item.leads;
          else if (hour < 6) leadsByHourChunk["03-06"] += item.leads;
          else if (hour < 9) leadsByHourChunk["06-09"] += item.leads;
          else if (hour < 12) leadsByHourChunk["09-12"] += item.leads;
          else if (hour < 15) leadsByHourChunk["12-15"] += item.leads;
          else if (hour < 18) leadsByHourChunk["15-18"] += item.leads;
          else if (hour < 21) leadsByHourChunk["18-21"] += item.leads;
          else leadsByHourChunk["21-24"] += item.leads;
        }
        data = Object.entries(leadsByHourChunk).map(([chunk, count]) => ({ day: chunk, value: count }));
        break;
      }
      case "7d": {
        description = "Últimos 7 días";
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        const weekData = leadsTimeSeries.filter((item) => new Date(item.date) >= sevenDaysAgo);

        const dayLabels = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(sevenDaysAgo);
          d.setDate(d.getDate() + i);
          return d.toLocaleDateString("es-ES", { weekday: "short" });
        });
        const leadsByDay = dayLabels.reduce((acc, label) => ({ ...acc, [label]: 0 }), {} as { [key: string]: number });

        for (const item of weekData) {
          const label = new Date(item.date).toLocaleDateString("es-ES", { weekday: "short" });
          if (label in leadsByDay) leadsByDay[label] += item.leads;
        }
        data = dayLabels.map((label) => ({ day: label, value: leadsByDay[label] }));
        break;
      }
      case "30d": {
        description = "Últimos 30 días";
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 29);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        const monthData = leadsTimeSeries.filter((item) => new Date(item.date) >= thirtyDaysAgo);

        const weekLabels = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];
        const leadsByWeek: { [key: string]: number } = { "Semana 1": 0, "Semana 2": 0, "Semana 3": 0, "Semana 4": 0 };
        const weekBoundaries = Array.from({ length: 3 }).map((_, i) => {
          const d = new Date(thirtyDaysAgo);
          d.setDate(d.getDate() + (i + 1) * 7);
          return d;
        });

        for (const item of monthData) {
          const d = new Date(item.date);
          if (d <= weekBoundaries[0]) leadsByWeek["Semana 1"] += item.leads;
          else if (d <= weekBoundaries[1]) leadsByWeek["Semana 2"] += item.leads;
          else if (d <= weekBoundaries[2]) leadsByWeek["Semana 3"] += item.leads;
          else leadsByWeek["Semana 4"] += item.leads;
        }
        data = weekLabels.map((label) => ({ day: label, value: leadsByWeek[label] }));
        break;
      }
      case "90d":
      default: {
        description = "Últimos 3 meses";
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(now.getDate() - 89);
        ninetyDaysAgo.setHours(0, 0, 0, 0);

        const monthLabels = [
          ...new Set(
            Array.from({ length: 90 }).map((_, i) => {
              const d = new Date(ninetyDaysAgo);
              d.setDate(d.getDate() + i);
              return d.toLocaleDateString("es-ES", { month: "long" });
            }),
          ),
        ];
        const leadsByMonth = monthLabels.reduce(
          (acc, label) => ({ ...acc, [label]: 0 }),
          {} as { [key: string]: number },
        );

        for (const item of leadsTimeSeries) {
          const label = new Date(item.date).toLocaleDateString("es-ES", { month: "long" });
          if (label in leadsByMonth) leadsByMonth[label] += item.leads;
        }
        data = monthLabels.map((label) => ({ day: label, value: leadsByMonth[label] }));
        break;
      }
    }
    return { data, description };
  }, [timeRange, leadsTimeSeries]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Leads por Periodo</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">3 meses</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 días</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 días</ToggleGroupItem>
            <ToggleGroupItem value="1d">Hoy</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Selecciona un rango" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Últimos 3 meses
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Últimos 30 días
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Últimos 7 días
              </SelectItem>
              <SelectItem value="1d" className="rounded-lg">
                Hoy
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={data} margin={{ top: 30, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-leads)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-leads)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              tickFormatter={(value) => value}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area dataKey="value" type="natural" fill="url(#fillValue)" stroke="var(--color-leads)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

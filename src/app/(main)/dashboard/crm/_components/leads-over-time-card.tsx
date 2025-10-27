"use client";

import * as React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

export function LeadsOverTimeCard({ series }: { series: { ts: number; found: number; contacted: number }[] }) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const timeRange = isMobile ? (searchParams.get("range") ?? "7d") : (searchParams.get("range") ?? "90d");

  const handleTimeRangeChange = React.useCallback(
    (newRange: string) => {
      if (newRange) {
        const params = new URLSearchParams(searchParams);
        params.set("range", newRange);
        router.push(`?${params.toString()}`);
      }
    },
    [router, searchParams],
  );

  React.useEffect(() => {
    if (isMobile && timeRange !== "1d") {
      handleTimeRangeChange("1d");
    }
  }, [isMobile, timeRange, handleTimeRangeChange]);

  const chartConfig = {
    found: { label: "Encontrados", color: "var(--chart-1)" },
    contacted: { label: "Contactados", color: "var(--chart-2)" },
  } satisfies ChartConfig;

  // eslint-disable-next-line complexity
  const ticks = React.useMemo(() => {
    if (!series || !series.length) return [] as number[];
    const n = series.length;
    switch (timeRange) {
      case "1d": {
        // Cada 3 horas exactas (00,03,06,...,21), más el último punto si no coincide
        const arr = series.filter((p) => new Date(p.ts).getHours() % 3 === 0).map((p) => p.ts);
        const last = series[n - 1].ts;
        if (arr[arr.length - 1] !== last) arr.push(last);
        return arr;
      }
      case "7d": {
        // 7 etiquetas (cada día)
        return series.map((p) => p.ts);
      }
      case "30d": {
        // Índices 0,5,10,15,20,25 y último
        const indices = [0, 5, 10, 15, 20, 25, n - 1].filter((i) => i >= 0 && i < n);
        const arr = Array.from(new Set(indices.map((i) => series[i].ts)));
        return arr;
      }
      case "90d":
      default: {
        // Primer punto de cada mes presente + último punto
        const seen = new Set<string>();
        const arr: number[] = [];
        for (const p of series) {
          const d = new Date(p.ts);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          if (!seen.has(key)) {
            seen.add(key);
            arr.push(p.ts);
          }
        }
        const last = series[n - 1].ts;
        if (arr[arr.length - 1] !== last) arr.push(last);
        return arr;
      }
    }
  }, [series, timeRange]);

  const description = React.useMemo(() => {
    switch (timeRange) {
      case "90d":
        return "Mostrando últimos 3 meses";
      case "30d":
        return "Mostrando últimos 30 días";
      case "7d":
        return "Mostrando últimos 7 días";
      case "1d":
        return "Mostrando últimas 24 horas";
      default:
        return "";
    }
  }, [timeRange]);

  const tickFormatter = React.useCallback(
    (value: number | string) => {
      const d = new Date(typeof value === "number" ? value : Date.parse(value));
      switch (timeRange) {
        case "1d":
          return d.toLocaleTimeString("es-ES", { hour: "2-digit" });
        case "7d": {
          const s = d.toLocaleDateString("es-ES", { weekday: "short" });
          return s.charAt(0).toUpperCase() + s.slice(1);
        }
        case "30d":
          return d.toLocaleDateString("es-ES", { month: "short", day: "numeric" });
        case "90d":
          return d.toLocaleDateString("es-ES", { month: "short" });
        default:
          return String(value);
      }
    },
    [timeRange],
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Leads por Fechas</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={handleTimeRangeChange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Últimos 3 meses</ToggleGroupItem>
            <ToggleGroupItem value="30d">Últimos 30 días</ToggleGroupItem>
            <ToggleGroupItem value="7d">Últimos 7 días</ToggleGroupItem>
            <ToggleGroupItem value="1d">Hoy</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
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
          <AreaChart data={series} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
            <defs>
              <linearGradient id="fillFound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-found)" stopOpacity={0.7} />
                <stop offset="95%" stopColor="var(--color-found)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillContacted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-contacted)" stopOpacity={0.7} />
                <stop offset="95%" stopColor="var(--color-contacted)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="ts"
              ticks={ticks}
              interval={0}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={16}
              tickFormatter={tickFormatter}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const d = new Date(typeof value === "number" ? value : Date.parse(String(value)));
                    if (timeRange === "1d") {
                      return d.toLocaleTimeString("es-ES", { hour: "2-digit" });
                    }
                    if (timeRange === "7d") {
                      const wd = d.toLocaleDateString("es-ES", { weekday: "long" });
                      const md = d.toLocaleDateString("es-ES", { month: "short", day: "numeric" });
                      return `${wd} · ${md}`;
                    }
                    if (timeRange === "30d") {
                      return d.toLocaleDateString("es-ES", { month: "short", day: "numeric" });
                    }
                    return d.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="contacted"
              name="Contactados"
              type="natural"
              fill="url(#fillContacted)"
              stroke="var(--color-contacted)"
              stackId="a"
            />
            <Area
              dataKey="found"
              name="Encontrados"
              type="natural"
              fill="url(#fillFound)"
              stroke="var(--color-found)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

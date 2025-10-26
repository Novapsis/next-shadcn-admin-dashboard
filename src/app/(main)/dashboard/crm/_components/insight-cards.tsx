"use client";

import { Pie, PieChart, Cell } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const channelColorMap: { [key: string]: string } = {
  Whatsapp: "oklch(0.65 0.2 145)",
  Instagram: "oklch(0.7 0.22 320)",
  Linkedin: "oklch(0.5 0.15 260)",
  Facebook: "oklch(0.67 0.14 205)",
  X: "oklch(0.73 0.2 50)",
};
const defaultColor = "oklch(0.7 0.1 200)"; // A default muted blue

export function InsightCards({ leadsByChannel }: { leadsByChannel: Record<string, number> }) {
  const chartData = Object.entries(leadsByChannel).map(([channel, count]) => {
    const name = channel.charAt(0).toUpperCase() + channel.slice(1);
    return { name, value: count };
  });
  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  const chartConfig = chartData.reduce((config, item) => {
    config[item.name] = {
      label: item.name,
    };
    return config;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads por Canal</CardTitle>
        <CardDescription>Distribución de leads según el canal de origen.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
          <div className="relative h-[240px]">
            <ChartContainer config={chartConfig} className="aspect-auto h-full">
              <PieChart margin={{ top: 12, bottom: 12, left: 8, right: 8 }}>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={6}
                  strokeWidth={8}
                  isAnimationActive={false}
                >
                  {chartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={channelColorMap[entry.name] || defaultColor} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl leading-none font-bold">{total}</div>
              <div className="text-muted-foreground mt-1 text-xs">Leads</div>
            </div>
          </div>
          <div className="space-y-2">
            {chartData.map((d) => (
              <div key={d.name} className="flex items-center">
                <span
                  className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: channelColorMap[d.name] || defaultColor }}
                />
                <span className="text-foreground/90 w-28 truncate text-sm">{d.name}</span>
                <span className="ml-auto text-sm font-medium tabular-nums">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-3">
        <Button variant="outline" className="rounded-full">
          Ver Reporte Completo
        </Button>
        <Button variant="outline" className="rounded-full">
          Descargar CSV
        </Button>
      </CardFooter>
    </Card>
  );
}

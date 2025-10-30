"use client";

import dynamic from "next/dynamic";

import { SidebarVariant, SidebarCollapsible } from "@/types/preferences/layout";

// Dynamically import AppSidebar with ssr: false to prevent hydration mismatches
const AppSidebar = dynamic(
  () => import("@/app/(main)/dashboard/crm/_components/sidebar/app-sidebar").then((mod) => mod.AppSidebar),
  { ssr: false },
);

interface ClientSidebarWrapperProps {
  variant: SidebarVariant;
  collapsible: SidebarCollapsible;
}

export function ClientSidebarWrapper({ variant, collapsible }: ClientSidebarWrapperProps) {
  return <AppSidebar variant={variant} collapsible={collapsible} />;
}

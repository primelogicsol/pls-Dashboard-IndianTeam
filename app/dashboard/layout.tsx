import { TooltipProvider } from "@radix-ui/react-tooltip";
import type React from "react";
import { Tooltip } from "recharts";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <TooltipProvider delayDuration={1000}>{children}</TooltipProvider>
    </div>
  );
}

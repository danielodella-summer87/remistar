"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DiscoveryDashboard } from "@/components/discovery/DiscoveryDashboard";

export default function RelevamientoPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Relevamiento" description="Ajuste del sistema a la realidad de Remistar." />
      <DiscoveryDashboard />
    </div>
  );
}

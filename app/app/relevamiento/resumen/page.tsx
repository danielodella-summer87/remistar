"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DiscoverySummary } from "@/components/discovery/DiscoverySummary";

export default function RelevamientoResumenPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Resumen del relevamiento" description="Perfil actual, procesos confirmados, supuestos, contradicciones y recomendaciones." />
      <DiscoverySummary />
    </div>
  );
}

"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DiscoveryPendingList } from "@/components/discovery/DiscoveryPendingList";

export default function RelevamientoPendientesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pendientes del relevamiento" description="Lo que falta responder, revisar o aportar antes de avanzar con el diseño." />
      <DiscoveryPendingList />
    </div>
  );
}

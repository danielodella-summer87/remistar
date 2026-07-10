"use client";

import { useMemo, useState } from "react";
import { BellOff } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar, FilterChip } from "@/components/shared/FilterBar";
import { MetricCard } from "@/components/shared/MetricCard";
import { AlertCard } from "@/components/shared/AlertCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { alerts } from "@/lib/mock";
import { alertModuleLabels } from "@/lib/status";
import type { Alert, AlertModule, AlertSeverity, AlertStatus } from "@/lib/types";

export default function AlertasPage() {
  const [severity, setSeverity] = useState<AlertSeverity | "todas">("todas");
  const [module, setModule] = useState<AlertModule | "todos">("todos");
  const [status, setStatus] = useState<AlertStatus | "todos">("todos");

  const modules = useMemo(() => Array.from(new Set(alerts.map((a) => a.module))), []);
  const responsibles = useMemo(() => Array.from(new Set(alerts.map((a) => a.responsible))), []);

  const filtered = alerts
    .filter((a: Alert) => (severity === "todas" ? true : a.severity === severity))
    .filter((a) => (module === "todos" ? true : a.module === module))
    .filter((a) => (status === "todos" ? true : a.status === status))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const critical = alerts.filter((a) => a.severity === "critica").length;
  const open = alerts.filter((a) => a.status === "abierta").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Alertas" description="Todas las alertas operativas, de flota, documentación, cobranza, liquidaciones, gastos, calidad y comercial en un solo lugar." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Alertas abiertas" value={open} tone="warning" />
        <MetricCard label="Críticas" value={critical} tone={critical > 0 ? "danger" : "success"} />
        <MetricCard label="Módulos con alertas" value={modules.length} tone="info" />
        <MetricCard label="Responsables únicos (demo)" value={responsibles.length} tone="neutral" />
      </div>

      <FilterBar>
        <div className="flex flex-wrap gap-2">
          {(["todas", "critica", "alta", "media", "baja"] as const).map((s) => (
            <FilterChip key={s} label={s === "todas" ? "Todas" : s[0].toUpperCase() + s.slice(1)} active={severity === s} onClick={() => setSeverity(s)} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip label="Todos los módulos" active={module === "todos"} onClick={() => setModule("todos")} />
          {modules.map((m) => (
            <FilterChip key={m} label={alertModuleLabels[m]} active={module === m} onClick={() => setModule(m)} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(["todos", "abierta", "en_revision", "resuelta"] as const).map((s) => (
            <FilterChip key={s} label={s === "todos" ? "Cualquier estado" : s === "abierta" ? "Abierta" : s === "en_revision" ? "En revisión" : "Resuelta"} active={status === s} onClick={() => setStatus(s)} />
          ))}
        </div>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState icon={BellOff} title="No hay alertas con estos filtros" description="Probá ajustar la criticidad, el módulo o el estado." />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <AlertCard key={a.id} alert={a} />
          ))}
        </div>
      )}
    </div>
  );
}

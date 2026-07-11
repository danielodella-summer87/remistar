"use client";

import { useMemo } from "react";
import { AlertTriangle, FileWarning } from "lucide-react";
import { useDiscoveryState } from "@/lib/discovery/store";
import { buildExportData, buildResponsibleGroups } from "@/lib/discovery/export";
import { DISCOVERY_RESPONSIBLE_LABELS } from "@/lib/discovery/types";
import { DiscoveryContradictionCard } from "./DiscoveryContradictionCard";

/** Fuente: docs/discovery/REMISTAR-DISCOVERY-1-cuestionario-operativo.md — "Material a solicitar (resumen)". */
const MATERIAL_A_SOLICITAR = [
  "Capturas reales de WhatsApp con consultas típicas.",
  "Planillas Excel o cuadernos usados para agenda, flota, choferes o cuentas corrientes.",
  "Ejemplo de factura emitida.",
  "Ejemplo de cédula verde, póliza de seguro y habilitación de un vehículo.",
  "Listado real (aunque informal) de choferes y vehículos.",
  "Tarifario, si existe.",
  "Ejemplo real y completo de una liquidación de chofer ya realizada.",
  "Ejemplos de comprobantes de gastos presentados por choferes.",
  "Registro histórico de adelantos entregados a choferes, si existe.",
  "Cualquier política escrita (o instrucción informal) sobre gastos permitidos.",
];

export function DiscoveryPendingList() {
  const state = useDiscoveryState();
  const data = useMemo(() => buildExportData(state), [state]);
  const groups = useMemo(() => buildResponsibleGroups(data), [data]);
  const criticalPending = data.pending.filter((p) => p.importance === "critico" && p.status === "sin_responder");
  const requiresReview = data.pending.filter((p) => p.status === "requiere_revision");
  const pendingRecommendations = data.recommendations.filter((r) => r.decision === "sugerida");

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
          <AlertTriangle className="h-4 w-4 text-amber-600" /> Preguntas críticas sin responder ({criticalPending.length})
        </h2>
        {criticalPending.length === 0 ? (
          <p className="text-sm text-slate-400">No hay preguntas críticas sin responder.</p>
        ) : (
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
            {criticalPending.map((p) => (
              <li key={p.id}>
                <span className="text-slate-400">[{p.section}]</span> {p.question}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Marcadas para revisar ({requiresReview.length})</h2>
        {requiresReview.length === 0 ? (
          <p className="text-sm text-slate-400">No hay preguntas marcadas para revisar.</p>
        ) : (
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
            {requiresReview.map((p) => (
              <li key={p.id}>
                <span className="text-slate-400">[{p.section}]</span> {p.question}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Contradicciones ({data.contradictions.length})</h2>
        {data.contradictions.length === 0 ? (
          <p className="text-sm text-slate-400">No hay contradicciones detectadas.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {data.contradictions.map((c) => (
              <DiscoveryContradictionCard key={c.id} contradiction={c} />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Decisiones pendientes ({pendingRecommendations.length})</h2>
        {pendingRecommendations.length === 0 ? (
          <p className="text-sm text-slate-400">No hay recomendaciones sin decidir.</p>
        ) : (
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
            {pendingRecommendations.map((r) => (
              <li key={r.id}>{r.title}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
          <FileWarning className="h-4 w-4 text-petrol-600" /> Documentos o ejemplos que debe aportar Gonzalo
        </h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
          {MATERIAL_A_SOLICITAR.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Agrupado por responsable</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(groups)
            .filter(([, items]) => items.length > 0)
            .map(([key, items]) => (
              <div key={key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {DISCOVERY_RESPONSIBLE_LABELS[key as keyof typeof DISCOVERY_RESPONSIBLE_LABELS]} ({items.length})
                </h3>
                <ul className="list-inside list-disc space-y-1 text-xs text-slate-600">
                  {items.map((item) => (
                    <li key={item.id}>{item.question}</li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DetailDrawer } from "@/components/shared/DetailDrawer";
import { opportunities } from "@/lib/mock";
import { opportunityStageMeta } from "@/lib/status";
import { formatCurrency } from "@/lib/format";
import type { CommercialOpportunity, OpportunityStage } from "@/lib/types";

const stages: OpportunityStage[] = ["nuevo", "contactado", "propuesta", "negociacion", "ganado", "perdido"];

const typeLabels: Record<CommercialOpportunity["type"], string> = {
  convenio_hotel: "Convenio con hotel",
  empresa: "Traslado de empresa",
  evento: "Evento",
  clinica: "Clínica",
  cliente_frecuente: "Cliente frecuente",
  agencia_turismo: "Agencia de turismo",
};

export default function OportunidadesPage() {
  const [selected, setSelected] = useState<CommercialOpportunity | null>(null);

  const totalPipeline = opportunities
    .filter((o) => o.stage !== "ganado" && o.stage !== "perdido")
    .reduce((sum, o) => sum + o.estimatedValue, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Oportunidades comerciales"
        description="Convenios, empresas y eventos potenciales, organizados como pipeline comercial."
        secondaryContent={
          <p className="mt-2 text-sm text-slate-600">
            Valor estimado en pipeline abierto: <strong className="text-slate-800">{formatCurrency(totalPipeline)}</strong>
          </p>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stages.map((stage) => {
          const meta = opportunityStageMeta(stage);
          const items = opportunities.filter((o) => o.stage === stage);
          return (
            <SectionCard key={stage} title={meta.label} className="flex flex-col">
              <div className="space-y-3">
                {items.length === 0 ? (
                  <p className="text-xs text-slate-400">Sin oportunidades en esta etapa.</p>
                ) : (
                  items.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setSelected(o)}
                      className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left transition-colors hover:border-petrol-300"
                    >
                      <p className="text-sm font-medium text-slate-900">{o.company}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{o.title}</p>
                      <p className="mt-2 text-xs font-semibold text-petrol-700">{formatCurrency(o.estimatedValue)}</p>
                    </button>
                  ))
                )}
              </div>
            </SectionCard>
          );
        })}
      </div>

      <DetailDrawer open={!!selected} onClose={() => setSelected(null)} title={selected?.company ?? ""} subtitle={selected?.title}>
        {selected && (
          <div className="space-y-5">
            <StatusBadge label={opportunityStageMeta(selected.stage).label} tone={opportunityStageMeta(selected.stage).tone} />
            <SectionCard title="Datos de la oportunidad">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <Field label="Tipo" value={typeLabels[selected.type]} />
                <Field label="Valor estimado" value={formatCurrency(selected.estimatedValue)} />
                <Field label="Probabilidad" value={`${selected.probability}%`} />
                <Field label="Responsable" value={selected.owner} />
                <Field label="Origen" value={selected.source} full />
                <Field label="Próxima acción" value={selected.nextAction} full />
              </dl>
            </SectionCard>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}

function Field({ label, value, full = false }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : undefined}>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}

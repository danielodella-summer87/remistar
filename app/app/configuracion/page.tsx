"use client";

import { Lock } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { DemoBadge } from "@/components/shared/DemoBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { usePersistedBoolean } from "@/hooks/usePersistedBoolean";

const integrations = [
  { name: "Base de datos real (Supabase)", note: "Se conecta después de validar el modelo de datos con Gonzalo." },
  { name: "Facturación electrónica (DGI)", note: "Se integra con el sistema real de Remistar; no se construye uno propio." },
  { name: "WhatsApp Business", note: "Para centralizar la captura de consultas — pendiente de Discovery." },
  { name: "Autenticación y roles reales", note: "Se define según quiénes usarán el sistema en el día a día." },
];

export default function ConfiguracionPage() {
  const [compactTables, setCompactTables] = usePersistedBoolean("remistar:pref-compact-tables", false);
  const [showDemoBadges, setShowDemoBadges] = usePersistedBoolean("remistar:pref-show-demo-badges", true);

  return (
    <div className="space-y-6">
      <PageHeader title="Configuración" description="Preferencias del entorno de demostración. Todavía no hay roles ni permisos reales." />

      <SectionCard title="Perfil">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-petrol-700 text-sm font-semibold text-white">GL</span>
          <div>
            <p className="text-sm font-medium text-slate-900">Gonzalo Larroque</p>
            <p className="text-xs text-slate-500">Usuario único de esta demo — roles y permisos reales se definen después del Discovery.</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Entorno" action={<DemoBadge label="Entorno demo" />}>
        <p className="text-sm text-slate-600">
          Esta aplicación funciona enteramente con datos de demostración, sin base de datos real, sin
          autenticación real y sin conexiones externas. Todo lo que veas puede reiniciarse recargando la página.
        </p>
      </SectionCard>

      <SectionCard title="Preferencias" description="Estas dos preferencias sí son funcionales y se guardan en este navegador.">
        <div className="space-y-4">
          <ToggleRow
            label="Tablas compactas"
            description="Reduce el espaciado de las listas para ver más filas por pantalla."
            checked={compactTables}
            onChange={setCompactTables}
          />
          <ToggleRow
            label="Mostrar etiqueta “Demo” en los datos"
            description="Recomendado mientras el sistema no tenga datos reales de Remistar."
            checked={showDemoBadges}
            onChange={setShowDemoBadges}
          />
        </div>
      </SectionCard>

      <SectionCard title="Integraciones (pendientes)" description="Ninguna de estas conexiones existe todavía en el prototipo.">
        <ul className="divide-y divide-slate-100">
          {integrations.map((i) => (
            <li key={i.name} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-800">{i.name}</p>
                <p className="text-xs text-slate-500">{i.note}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge label="No conectado" tone="neutral" />
                <Lock className="h-3.5 w-3.5 text-slate-300" aria-label="Bloqueado en esta etapa" />
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-petrol-600" : "bg-slate-200"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

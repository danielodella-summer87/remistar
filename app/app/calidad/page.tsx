"use client";

import { Star, MessageSquareWarning } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { surveys, drivers } from "@/lib/mock";
import { clientLabel, getService } from "@/lib/selectors";
import { formatDate } from "@/lib/format";

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export default function CalidadPage() {
  const overallAvg = average(surveys.map((s) => s.overallScore));
  const punctualityAvg = average(surveys.map((s) => s.punctualityScore));
  const complaints = surveys.filter((s) => s.hasComplaint);

  const driverRanking = drivers
    .map((d) => {
      const driverSurveys = surveys.filter((s) => getService(s.serviceId)?.driverId === d.id);
      return { driver: d, avg: average(driverSurveys.map((s) => s.driverScore)), count: driverSurveys.length };
    })
    .filter((r) => r.count > 0)
    .sort((a, b) => b.avg - a.avg);

  return (
    <div className="space-y-6">
      <PageHeader title="Calidad" description="Satisfacción de clientes, puntualidad y reclamos a partir de las encuestas post-servicio." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Satisfacción promedio" value={`${overallAvg.toFixed(1)} / 5`} icon={Star} tone="brand" />
        <MetricCard label="Puntualidad promedio" value={`${punctualityAvg.toFixed(1)} / 5`} tone="info" />
        <MetricCard label="Reclamos" value={complaints.length} tone={complaints.length > 0 ? "danger" : "success"} />
        <MetricCard label="Encuestas registradas" value={surveys.length} tone="neutral" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard title="Calificación por chofer" description="Promedio de calificación recibida en las encuestas.">
          {driverRanking.length === 0 ? (
            <p className="text-sm text-slate-500">Sin datos suficientes todavía.</p>
          ) : (
            <ul className="space-y-2.5">
              {driverRanking.map((r) => (
                <li key={r.driver.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{r.driver.name}</span>
                  <span className="flex items-center gap-1 font-medium text-slate-800">
                    <Star className="h-3.5 w-3.5 text-amber-400" /> {r.avg.toFixed(1)} ({r.count})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Reclamos y acciones de recuperación" description="Encuestas con reclamo registrado; requieren seguimiento comercial.">
          {complaints.length === 0 ? (
            <p className="text-sm text-slate-500">No hay reclamos registrados.</p>
          ) : (
            <ul className="space-y-3">
              {complaints.map((s) => {
                const service = getService(s.serviceId);
                return (
                  <li key={s.id} className="rounded-lg border border-red-100 bg-red-50/50 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800">{clientLabel(s.clientId)}</span>
                      <StatusBadge label={`${s.overallScore}/5`} tone="danger" />
                    </div>
                    {s.comment && <p className="mt-1 text-xs text-slate-600">“{s.comment}”</p>}
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-petrol-700">
                      <MessageSquareWarning className="h-3.5 w-3.5" />
                      Acción sugerida: contactar al cliente y revisar el caso con
                      {service?.driverId ? " el chofer asignado." : " el equipo operativo."}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Todas las encuestas">
        <ul className="divide-y divide-slate-100">
          {surveys.map((s) => (
            <li key={s.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">{clientLabel(s.clientId)}</p>
                <p className="text-xs text-slate-500">{formatDate(s.date)}{s.comment ? ` — "${s.comment}"` : ""}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>General {s.overallScore}/5</span>
                <span>· Puntualidad {s.punctualityScore}/5</span>
                {s.hasComplaint && <StatusBadge label="Con reclamo" tone="danger" />}
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}

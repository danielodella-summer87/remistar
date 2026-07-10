import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Section, SectionHeading } from "@/components/public/Section";
import { DemoBadge } from "@/components/shared/DemoBadge";
import { empresaFeatures } from "@/lib/public-content";
import { clients } from "@/lib/mock";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = {
  title: "Empresas",
  description: "Cuentas corporativas, facturación centralizada y traslados recurrentes para empresas.",
};

export default function EmpresasPage() {
  const corporateClients = clients.filter((c) => c.type === "corporativo");

  return (
    <>
      <section className="bg-petrol-950">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-opgreen-400">Empresas</p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Un solo punto de coordinación para todos los traslados de tu equipo
          </h1>
          <p className="mt-4 text-base text-petrol-200">
            Convenios corporativos, facturación centralizada y atención prioritaria, sin que cada
            traslado dependa de coordinar con una persona distinta.
          </p>
          <Link
            href="/contacto"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-opgreen-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-opgreen-600"
          >
            Conversar sobre un convenio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Section>
        <SectionHeading eyebrow="Qué incluye" title="El programa corporativo de Remistar" />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {empresaFeatures.map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <CheckCircle2 className="h-5 w-5 text-opgreen-600" />
              <p className="mt-3 text-sm font-semibold text-slate-900">{f.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section alt>
        <div className="flex items-center justify-between gap-3">
          <SectionHeading title="Empresas que ya coordinan con Remistar" />
        </div>
        <div className="mt-2 flex justify-center">
          <DemoBadge label="Clientes de demostración" />
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {corporateClients.map((c) => (
            <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">{c.name}</p>
              <p className="mt-1 text-xs text-slate-500">{c.address}</p>
              <p className="mt-3 text-xs text-slate-500">
                <span className="font-medium text-slate-700">{c.totalServices}</span> traslados coordinados
                {c.paymentTerms && (
                  <>
                    {" "}· <span className="text-slate-600">{c.paymentTerms}</span>
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          Cifras de demostración (por ejemplo, saldo de referencia {formatCurrency(corporateClients[0]?.balance ?? 0)}
          {" "}en la primera cuenta) — no representan datos reales de Remistar.
        </p>
      </Section>
    </>
  );
}

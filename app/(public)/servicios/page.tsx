import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/public/Section";
import { serviceTypesContent } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Traslados al aeropuerto, corporativos, ejecutivos, eventos, viajes al interior y más.",
};

export default function ServiciosPage() {
  return (
    <>
      <Section className="pb-10">
        <SectionHeading
          eyebrow="Servicios"
          title="Cada traslado, coordinado según lo que realmente necesitás"
          description="Ocho formas de viajar con Remistar. Todas parten del mismo criterio: confirmar antes de coordinar, y coordinar antes de asignar."
        />
      </Section>

      <Section alt className="pt-0">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {serviceTypesContent.map((s) => (
            <div key={s.type} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-petrol-50 text-petrol-700">
                <s.icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-base font-semibold text-slate-900">{s.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.longDescription}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="text-center">
        <h2 className="text-xl font-bold text-slate-900">¿Ya sabés qué traslado necesitás?</h2>
        <p className="mt-2 text-sm text-slate-600">Iniciá tu solicitud y te confirmamos disponibilidad y precio.</p>
        <Link
          href="/solicitar-traslado"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-petrol-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-petrol-800"
        >
          Solicitar traslado
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Section>
    </>
  );
}

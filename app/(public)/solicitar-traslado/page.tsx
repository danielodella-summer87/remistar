import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/public/Section";
import { RequestTripForm } from "@/components/public/RequestTripForm";

export const metadata: Metadata = {
  title: "Solicitar traslado",
  description: "Solicitá tu traslado en unos pasos. Te confirmamos precio y disponibilidad antes de coordinar.",
};

export default function SolicitarTrasladoPage() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Solicitar traslado"
        title="Contanos qué necesitás"
        description="Completá los siguientes pasos. No se cobra ni se confirma nada hasta que lo validemos con vos."
      />
      <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <RequestTripForm />
      </div>
    </Section>
  );
}

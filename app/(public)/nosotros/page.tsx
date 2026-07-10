import type { Metadata } from "next";
import { ShieldCheck, Clock3, Radar, Users2 } from "lucide-react";
import { Section, SectionHeading } from "@/components/public/Section";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Quiénes somos y qué principios guían la forma en que Remistar coordina cada traslado.",
};

const values = [
  { icon: ShieldCheck, title: "Confianza", description: "Cada vehículo y cada chofer se verifican antes de asignarse a un servicio." },
  { icon: Clock3, title: "Puntualidad", description: "Coordinamos con margen, no contra el reloj." },
  { icon: Radar, title: "Coordinación", description: "Un mismo criterio detrás de cada traslado, sin importar quién lo atienda." },
  { icon: Users2, title: "Experiencia", description: "El conocimiento acumulado de cada viaje se traduce en mejores decisiones para el siguiente." },
];

export default function NosotrosPage() {
  return (
    <>
      <Section className="pb-10">
        <SectionHeading
          eyebrow="Nosotros"
          title="Coordinamos traslados como si cada uno fuera el único del día"
          description="Remistar nació para resolver un problema simple de enunciar y difícil de sostener: que cada traslado llegue a horario, con el vehículo y el chofer correctos, sin depender de la suerte."
        />
      </Section>

      <Section alt>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-petrol-700 text-white">
                <v.icon className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-3 text-sm font-semibold text-slate-900">{v.title}</p>
              <p className="mt-1.5 text-sm text-slate-600">{v.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900">Cómo trabajamos</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Detrás de cada traslado hay una decisión: qué chofer y qué vehículo son los adecuados
            para ese viaje puntual. Esa decisión considera la disponibilidad real, el estado de la
            flota y la experiencia acumulada con cada cliente — no solo quién está más cerca.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Esa misma lógica de coordinación es la que estamos convirtiendo en un sistema propio,
            Remistar Intelligence, para sostener la calidad del servicio a medida que crecemos.
          </p>
          <p className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-slate-500">
            Esta página presenta el posicionamiento institucional de forma preliminar. La historia,
            los hitos y las cifras concretas de la empresa todavía deben completarse junto con Gonzalo.
          </p>
        </div>
      </Section>
    </>
  );
}

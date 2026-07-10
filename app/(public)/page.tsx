import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Section, SectionHeading } from "@/components/public/Section";
import { ServiceTypeCard } from "@/components/public/ServiceTypeCard";
import { FleetCard } from "@/components/public/FleetCard";
import { WhatsAppLink } from "@/components/public/WhatsAppLink";
import { vehicles } from "@/lib/mock";
import { serviceTypesContent, whyItems, howItWorksSteps, empresaFeatures } from "@/lib/public-content";

export default function HomePage() {
  const fleetSample = vehicles.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-petrol-950">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-petrol-700/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-opgreen-600/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28 lg:px-8">
          <div>
            <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-opgreen-300">
              Traslados ejecutivos en Uruguay
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              Movilidad y coordinación inteligente para quienes no pueden perder tiempo.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-petrol-200">
              Remistar coordina cada traslado con confianza, puntualidad y control operativo real:
              elegimos el chofer y el vehículo adecuados, y seguimos el viaje de principio a fin.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/solicitar-traslado"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-opgreen-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-opgreen-500/20 transition-colors hover:bg-opgreen-600"
              >
                Solicitar traslado
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/empresas"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Servicios para empresas
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-petrol-300">
                  Servicio en curso
                </p>
                <span className="rounded-full bg-opgreen-500/20 px-2 py-0.5 text-[11px] font-medium text-opgreen-300">
                  Demo
                </span>
              </div>
              <p className="mt-3 text-lg font-semibold text-white">
                Hotel Costanera Suites → Aeropuerto de Carrasco
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-[11px] text-petrol-300">Chofer</p>
                  <p className="mt-0.5 font-medium text-white">Fabián Correa</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-[11px] text-petrol-300">Vehículo</p>
                  <p className="mt-0.5 font-medium text-white">Toyota Corolla</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-[11px] text-petrol-300">Salida</p>
                  <p className="mt-0.5 font-medium text-white">07:30</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-[11px] text-petrol-300">Estado</p>
                  <p className="mt-0.5 font-medium text-opgreen-300">En camino</p>
                </div>
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-petrol-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-opgreen-400" />
                Vehículo verificado — documentación y mantenimiento al día
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS PRINCIPALES */}
      <Section>
        <SectionHeading
          eyebrow="Servicios"
          title="Un servicio para cada tipo de traslado"
          description="Desde un viaje puntual al aeropuerto hasta la coordinación diaria de un equipo corporativo."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {serviceTypesContent.map((s) => (
            <ServiceTypeCard key={s.title} icon={s.icon} title={s.title} description={s.description} />
          ))}
        </div>
      </Section>

      {/* POR QUÉ REMISTAR */}
      <Section alt>
        <SectionHeading
          eyebrow="Por qué Remistar"
          title="Control operativo real, no solo un traslado"
          description="Cada viaje se coordina con el mismo criterio, esté quien esté del otro lado del teléfono."
        />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyItems.map((w) => (
            <div key={w.title} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-petrol-700 text-white">
                <w.icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{w.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{w.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* EMPRESAS */}
      <Section>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-opgreen-600">Empresas</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Un programa corporativo pensado para simplificar, no para sumar tareas
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Cuentas corporativas con condiciones propias, pasajeros habilitados y facturación
              centralizada, para que coordinar traslados no dependa de una persona.
            </p>
            <Link
              href="/empresas"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-petrol-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-petrol-800"
            >
              Conocé el programa para empresas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {empresaFeatures.map((f) => (
              <li key={f.title} className="flex items-start gap-2.5 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-opgreen-600" />
                <span>
                  <span className="font-medium text-slate-900">{f.title}.</span> {f.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* FLOTA */}
      <Section alt>
        <SectionHeading
          eyebrow="Flota"
          title="Vehículos verificados para cada tipo de viaje"
          description="Una muestra de nuestra flota. Los datos de cada unidad son de demostración."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {fleetSample.map((v) => (
            <FleetCard key={v.id} vehicle={v} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/flota" className="text-sm font-semibold text-petrol-700 hover:text-petrol-900">
            Ver toda la flota →
          </Link>
        </div>
      </Section>

      {/* CÓMO FUNCIONA */}
      <Section>
        <SectionHeading eyebrow="Cómo funciona" title="De la solicitud al traslado, sin fricciones" />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-5">
          {howItWorksSteps.map((step, idx) => (
            <div key={step.title} className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-petrol-700 text-sm font-bold text-white">
                {idx + 1}
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-900">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA FINAL */}
      <section className="bg-petrol-900">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            ¿Coordinamos tu próximo traslado?
          </h2>
          <p className="mt-3 text-base text-petrol-200">
            Contanos qué necesitás y te confirmamos disponibilidad y precio antes de coordinar nada.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/solicitar-traslado"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-opgreen-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-opgreen-500/20 transition-colors hover:bg-opgreen-600"
            >
              Solicitar traslado
              <ArrowRight className="h-4 w-4" />
            </Link>
            <WhatsAppLink className="bg-white/5 !text-white hover:!text-opgreen-300 border-white/20" />
          </div>
        </div>
      </section>
    </>
  );
}

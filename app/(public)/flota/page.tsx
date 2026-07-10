import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/public/Section";
import { FleetCard } from "@/components/public/FleetCard";
import { vehicles } from "@/lib/mock";

export const metadata: Metadata = {
  title: "Flota",
  description: "Vehículos verificados para cada tipo de traslado: sedanes ejecutivos, vans, SUV y minibuses.",
};

export default function FlotaPage() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Flota"
        title="Vehículos verificados, para cada tipo de viaje"
        description="Cada unidad se asigna solo si su mantenimiento y documentación están al día. Los datos mostrados son de demostración."
      />
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {vehicles.map((v) => (
          <FleetCard key={v.id} vehicle={v} />
        ))}
      </div>
    </Section>
  );
}

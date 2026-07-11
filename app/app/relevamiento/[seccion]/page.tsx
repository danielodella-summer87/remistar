import { notFound } from "next/navigation";
import { getSectionBySlug } from "@/lib/discovery/sections";
import { DiscoverySectionRunner } from "@/components/discovery/DiscoverySectionRunner";

export default async function RelevamientoSeccionPage({ params }: { params: Promise<{ seccion: string }> }) {
  const { seccion } = await params;
  const section = getSectionBySlug(seccion);
  if (!section) notFound();

  return (
    <div className="space-y-6">
      <DiscoverySectionRunner section={section} />
    </div>
  );
}

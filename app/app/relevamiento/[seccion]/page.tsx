import { notFound } from "next/navigation";
import { getSectionBySlug } from "@/lib/discovery/sections";
import { DiscoverySectionRunner } from "@/components/discovery/DiscoverySectionRunner";

export default async function RelevamientoSeccionPage({
  params,
  searchParams,
}: {
  params: Promise<{ seccion: string }>;
  searchParams: Promise<{ pregunta?: string }>;
}) {
  const { seccion } = await params;
  const { pregunta } = await searchParams;
  const section = getSectionBySlug(seccion);
  if (!section) notFound();

  return (
    <div className="space-y-6">
      <DiscoverySectionRunner section={section} initialQuestionId={pregunta} />
    </div>
  );
}

import Link from "next/link";
import { Pencil } from "lucide-react";
import { questionHref } from "@/lib/discovery/links";

/** Acceso rápido para reabrir y editar una pregunta puntual desde cualquier pantalla (resumen, pendientes, recomendaciones, contradicciones). */
export function DiscoveryEditLink({ questionId, label = "Editar respuesta" }: { questionId: string; label?: string }) {
  const href = questionHref(questionId);
  if (!href) return null;
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-[11px] font-medium text-petrol-700 hover:underline">
      <Pencil className="h-3 w-3" />
      {label}
    </Link>
  );
}

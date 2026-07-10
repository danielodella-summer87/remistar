import { MessageCircle } from "lucide-react";

export function WhatsAppLink({ className = "" }: { className?: string }) {
  const message = encodeURIComponent("Hola, quiero información sobre un traslado (demo).");
  return (
    <a
      href={`https://wa.me/59800000000?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-opgreen-400 hover:text-opgreen-700 ${className}`}
    >
      <MessageCircle className="h-4 w-4" />
      Contactar por WhatsApp (demo)
    </a>
  );
}

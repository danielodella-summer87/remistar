import { Lightbulb, Target } from "lucide-react";

export function DiscoveryTip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-sky-50 px-3 py-2 text-xs text-sky-800 ring-1 ring-inset ring-sky-100">
      <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>
        <span className="font-semibold">Qué necesitamos saber: </span>
        {text}
      </span>
    </div>
  );
}

export function DiscoveryWhy({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-petrol-50 px-3 py-2 text-xs text-petrol-800 ring-1 ring-inset ring-petrol-100">
      <Target className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>
        <span className="font-semibold">Para qué lo necesitamos: </span>
        {text}
      </span>
    </div>
  );
}

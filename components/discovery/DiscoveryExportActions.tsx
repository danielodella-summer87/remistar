"use client";

import { useState } from "react";
import { Copy, Download, FileJson, Printer, Check } from "lucide-react";
import type { DiscoveryExportData } from "@/lib/discovery/export";
import { buildExportMarkdown } from "@/lib/discovery/export";

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function DiscoveryExportActions({ data }: { data: DiscoveryExportData }) {
  const [copied, setCopied] = useState(false);
  const markdown = buildExportMarkdown(data);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard no disponible — se ignora en esta demo.
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-opgreen-600" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copiado" : "Copiar resumen"}
      </button>
      <button
        type="button"
        onClick={() => downloadFile("remistar-relevamiento.json", JSON.stringify(data, null, 2), "application/json")}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
      >
        <FileJson className="h-3.5 w-3.5" />
        Descargar JSON
      </button>
      <button
        type="button"
        onClick={() => downloadFile("remistar-relevamiento.md", markdown, "text/markdown")}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
      >
        <Download className="h-3.5 w-3.5" />
        Descargar Markdown
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
      >
        <Printer className="h-3.5 w-3.5" />
        Imprimir
      </button>
    </div>
  );
}

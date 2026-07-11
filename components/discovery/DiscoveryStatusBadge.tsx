import { StatusBadge } from "@/components/shared/StatusBadge";
import { discoveryStatusMeta, discoverySectionStatusMeta } from "@/lib/status";
import type { DiscoveryStatus, DiscoverySectionStatus } from "@/lib/discovery/types";

export function DiscoveryStatusBadge({ status }: { status: DiscoveryStatus }) {
  const meta = discoveryStatusMeta(status);
  return <StatusBadge label={meta.label} tone={meta.tone} />;
}

export function DiscoverySectionStatusBadge({ status }: { status: DiscoverySectionStatus }) {
  const meta = discoverySectionStatusMeta(status);
  return <StatusBadge label={meta.label} tone={meta.tone} />;
}

export function DiscoveryImportanceBadge({ importance }: { importance: "critico" | "importante" | "complementario" }) {
  const map = {
    critico: { label: "Crítico", tone: "danger" as const },
    importante: { label: "Importante", tone: "warning" as const },
    complementario: { label: "Complementario", tone: "neutral" as const },
  };
  const meta = map[importance];
  return <StatusBadge label={meta.label} tone={meta.tone} />;
}

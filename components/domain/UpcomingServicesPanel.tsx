"use client";

import { useState } from "react";
import type { Service } from "@/lib/types";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DetailDrawer } from "@/components/shared/DetailDrawer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ServiceDetailContent } from "./ServiceDetailContent";
import { serviceStatusMeta, riskMeta } from "@/lib/status";
import { clientLabel, driverLabel, vehicleLabel } from "@/lib/selectors";
import { formatCurrency } from "@/lib/format";

export function UpcomingServicesPanel({ services }: { services: Service[] }) {
  const [selected, setSelected] = useState<Service | null>(null);

  const columns: DataTableColumn<Service>[] = [
    { header: "Hora", accessor: (s) => <span className="font-medium text-slate-900">{s.time}</span> },
    { header: "Cliente", accessor: (s) => clientLabel(s.clientId) },
    { header: "Origen → Destino", accessor: (s) => <span className="text-slate-600">{s.origin} → {s.destination}</span> },
    { header: "Chofer", accessor: (s) => driverLabel(s.driverId) },
    { header: "Vehículo", accessor: (s) => vehicleLabel(s.vehicleId) },
    { header: "Importe", accessor: (s) => formatCurrency(s.amount) },
    {
      header: "Estado",
      accessor: (s) => {
        const meta = serviceStatusMeta(s.status);
        return <StatusBadge label={meta.label} tone={meta.tone} />;
      },
    },
    {
      header: "Riesgo",
      accessor: (s) => {
        const meta = riskMeta(s.risk);
        return <StatusBadge label={meta.label} tone={meta.tone} />;
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={services}
        keyFor={(s) => s.id}
        onRowClick={(s) => setSelected(s)}
        emptyMessage="No hay servicios próximos para mostrar."
      />
      <DetailDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Servicio ${selected.code}` : ""}
        subtitle={selected ? `${selected.origin} → ${selected.destination}` : undefined}
      >
        {selected && <ServiceDetailContent service={selected} />}
      </DetailDrawer>
    </>
  );
}

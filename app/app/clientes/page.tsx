"use client";

import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar, SearchInput, FilterChip } from "@/components/shared/FilterBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DetailDrawer } from "@/components/shared/DetailDrawer";
import { ClientDetailContent } from "@/components/domain/ClientDetailContent";
import { clients } from "@/lib/mock";
import { formatCurrency } from "@/lib/format";
import type { Client, ClientType } from "@/lib/types";

export default function ClientesPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<ClientType | "todos">("todos");
  const [selected, setSelected] = useState<Client | null>(null);

  const filtered = useMemo(() => {
    return clients
      .filter((c) => (type === "todos" ? true : c.type === type))
      .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  }, [search, type]);

  return (
    <div className="space-y-6">
      <PageHeader title="Clientes" description="Particulares y cuentas corporativas registradas en Remistar." />

      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar cliente…" />
        <div className="flex gap-2">
          <FilterChip label="Todos" active={type === "todos"} onClick={() => setType("todos")} count={clients.length} />
          <FilterChip label="Corporativos" active={type === "corporativo"} onClick={() => setType("corporativo")} count={clients.filter((c) => c.type === "corporativo").length} />
          <FilterChip label="Particulares" active={type === "particular"} onClick={() => setType("particular")} count={clients.filter((c) => c.type === "particular").length} />
        </div>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No se encontraron clientes" description="Probá con otro término de búsqueda o cambiá el filtro." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelected(c)}
              className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                <StatusBadge label={c.type === "corporativo" ? "Corporativo" : "Particular"} tone={c.type === "corporativo" ? "brand" : "neutral"} />
              </div>
              <p className="mt-1 text-xs text-slate-500">{c.email}</p>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <span className="text-slate-500">{c.totalServices} servicios</span>
                <span className={`font-medium ${c.balance < 0 ? "text-red-600" : "text-opgreen-700"}`}>
                  {formatCurrency(c.balance)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <DetailDrawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ""} subtitle="Ficha de cliente">
        {selected && <ClientDetailContent client={selected} />}
      </DetailDrawer>
    </div>
  );
}

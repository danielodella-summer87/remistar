"use client";

import { useState } from "react";
import { UserCircle } from "lucide-react";

export interface DiscoveryIdentityValues {
  intervieweeName: string;
  companyName: string;
  email?: string;
  phone?: string;
}

/**
 * Captura mínima de identidad antes de crear la primera sesión remota en Supabase.
 * Nombre y empresa son obligatorios; email y teléfono son opcionales. No navega ni
 * guarda nada por sí sola: delega en onSubmit para que quien la abre decida qué hacer.
 */
export function DiscoveryIdentityDialog({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: DiscoveryIdentityValues) => void;
}) {
  const [intervieweeName, setIntervieweeName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = intervieweeName.trim();
    const trimmedCompany = companyName.trim();
    if (!trimmedName || !trimmedCompany) {
      setError("Nombre del entrevistado y empresa son obligatorios.");
      return;
    }
    setError(null);
    onSubmit({
      intervieweeName: trimmedName,
      companyName: trimmedCompany,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-center gap-2 text-slate-700">
          <UserCircle className="h-5 w-5" />
          <h3 className="text-sm font-semibold text-slate-900">Antes de empezar</h3>
        </div>
        <p className="text-sm text-slate-600">
          Necesitamos saber quién responde para poder guardar esta consulta correctamente.
        </p>

        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <label className="block text-xs font-medium text-slate-600">
            Nombre del entrevistado *
            <input
              type="text"
              value={intervieweeName}
              onChange={(e) => setIntervieweeName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-petrol-500 focus:outline-none focus:ring-1 focus:ring-petrol-500"
              autoFocus
            />
          </label>
          <label className="block text-xs font-medium text-slate-600">
            Empresa *
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-petrol-500 focus:outline-none focus:ring-1 focus:ring-petrol-500"
            />
          </label>
          <label className="block text-xs font-medium text-slate-600">
            Email (opcional)
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-petrol-500 focus:outline-none focus:ring-1 focus:ring-petrol-500"
            />
          </label>
          <label className="block text-xs font-medium text-slate-600">
            Teléfono (opcional)
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-petrol-500 focus:outline-none focus:ring-1 focus:ring-petrol-500"
            />
          </label>

          {error && <p className="text-xs font-medium text-red-600">{error}</p>}

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-petrol-600 px-3 py-2 text-sm font-semibold text-white hover:bg-petrol-700"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

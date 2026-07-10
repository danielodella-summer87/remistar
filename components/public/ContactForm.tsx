"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nextErrors: Record<string, string> = {};
    if (!String(form.get("name") ?? "").trim()) nextErrors.name = "Ingresá tu nombre.";
    if (!String(form.get("email") ?? "").trim()) nextErrors.email = "Ingresá un email de contacto.";
    if (!String(form.get("message") ?? "").trim()) nextErrors.message = "Contanos brevemente qué necesitás.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-opgreen-200 bg-opgreen-50 p-8 text-center">
        <CheckCircle2 className="h-8 w-8 text-opgreen-600" />
        <p className="text-sm font-semibold text-opgreen-800">Mensaje recibido (demo)</p>
        <p className="max-w-sm text-xs text-opgreen-700">
          En la versión real, este mensaje llegaría al equipo de Remistar. Como este es un
          prototipo, no se envió a ningún sistema.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-2 text-xs font-medium text-opgreen-800 underline underline-offset-2"
        >
          Enviar otro mensaje de prueba
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-xs font-medium text-slate-700">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-petrol-400 focus:outline-none focus:ring-2 focus:ring-petrol-100"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-petrol-400 focus:outline-none focus:ring-2 focus:ring-petrol-100"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-xs font-medium text-slate-700">
            Teléfono (opcional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-petrol-400 focus:outline-none focus:ring-2 focus:ring-petrol-100"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-xs font-medium text-slate-700">
          ¿En qué te podemos ayudar?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-petrol-400 focus:outline-none focus:ring-2 focus:ring-petrol-100"
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-petrol-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-petrol-800 sm:w-auto"
      >
        Enviar mensaje
      </button>
      <p className="text-xs text-slate-400">
        Este formulario es una demostración: no envía datos a ningún sistema real.
      </p>
    </form>
  );
}

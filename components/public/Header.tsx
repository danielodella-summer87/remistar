"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "./Container";

const navLinks = [
  { href: "/servicios", label: "Servicios" },
  { href: "/empresas", label: "Empresas" },
  { href: "/flota", label: "Flota" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex flex-col leading-none" onClick={() => setOpen(false)}>
          <span className="text-lg font-bold tracking-tight text-petrol-800">
            Remistar<span className="text-opgreen-600">.</span>
          </span>
          <span className="hidden text-[11px] font-medium text-slate-500 sm:block">
            Movilidad y coordinación inteligente
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-petrol-700"
                  : "text-slate-600 hover:text-petrol-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/app"
            className="text-sm font-medium text-slate-500 hover:text-petrol-700"
          >
            Acceso interno
          </Link>
          <Link
            href="/solicitar-traslado"
            className="rounded-lg bg-petrol-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-petrol-800"
          >
            Solicitar traslado
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/app"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50"
            >
              Acceso interno
            </Link>
            <Link
              href="/solicitar-traslado"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg bg-petrol-700 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-petrol-800"
            >
              Solicitar traslado
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}

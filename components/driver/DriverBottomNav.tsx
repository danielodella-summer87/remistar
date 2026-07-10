"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, Route, Receipt, Banknote, MoreHorizontal, Car, TriangleAlert, UserRound, LogOut } from "lucide-react";
import { ConfirmationSheet } from "./ConfirmationSheet";

const mainItems = [
  { href: "/chofer", label: "Inicio", icon: Home, exact: true },
  { href: "/chofer/servicios", label: "Servicios", icon: Route, exact: false },
  { href: "/chofer/gastos", label: "Gastos", icon: Receipt, exact: false },
  { href: "/chofer/liquidaciones", label: "Liquidaciones", icon: Banknote, exact: false },
];

const moreItems = [
  { href: "/chofer/vehiculo", label: "Mi vehículo", icon: Car },
  { href: "/chofer/incidencias", label: "Incidencias", icon: TriangleAlert },
  { href: "/chofer/perfil", label: "Mi perfil", icon: UserRound },
];

function isActive(pathname: string, href: string, exact: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function DriverBottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = moreItems.some((i) => isActive(pathname, i.href, false));

  return (
    <>
      <nav className="sticky bottom-0 z-30 w-full border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="grid grid-cols-5">
          {mainItems.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                  active ? "text-petrol-700" : "text-slate-500"
                }`}
              >
                <item.icon className={`h-5 w-5 ${active ? "text-petrol-700" : "text-slate-400"}`} />
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
              moreActive ? "text-petrol-700" : "text-slate-500"
            }`}
          >
            <MoreHorizontal className={`h-5 w-5 ${moreActive ? "text-petrol-700" : "text-slate-400"}`} />
            Más
          </button>
        </div>
      </nav>

      <ConfirmationSheet open={moreOpen} onClose={() => setMoreOpen(false)} title="Más">
        <div className="space-y-2">
          {moreItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMoreOpen(false)}
              className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-800 active:bg-slate-50"
            >
              <item.icon className="h-5 w-5 text-petrol-700" />
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            onClick={() => setMoreOpen(false)}
            className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-500 active:bg-slate-50"
          >
            <LogOut className="h-5 w-5" />
            Salir del modo demo
          </Link>
        </div>
      </ConfirmationSheet>
    </>
  );
}

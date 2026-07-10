"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { navGroups } from "./nav-config";

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  Icon,
  active,
  collapsed,
  onNavigate,
}: {
  href: string;
  label: string;
  Icon: (typeof navGroups)[number]["items"][number]["icon"];
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <li className="group relative">
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          active
            ? "bg-petrol-700 text-white"
            : "text-petrol-100/80 hover:bg-petrol-800 hover:text-white"
        } ${collapsed ? "justify-center" : ""}`}
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden />
        {!collapsed && <span className="truncate">{label}</span>}
      </Link>
      {collapsed && (
        <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-petrol-950 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
          {label}
        </span>
      )}
    </li>
  );
}

function SidebarContent({
  collapsed,
  onToggleCollapse,
  onNavigate,
  showCollapseToggle,
}: {
  collapsed: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
  showCollapseToggle: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-petrol-900">
      <div className={`flex items-center gap-2 border-b border-petrol-800 px-4 py-4 ${collapsed ? "justify-center px-2" : ""}`}>
        {collapsed ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-opgreen-500 text-sm font-bold text-white">R</span>
        ) : (
          <div className="min-w-0">
            <p className="text-base font-semibold leading-tight text-white">
              Remistar <span className="text-opgreen-400">Intelligence</span>
            </p>
            <p className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-medium text-amber-300">
              Entorno demo
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-2 py-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-petrol-300/70">
                {group.label}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  Icon={item.icon}
                  active={isActive(pathname, item.href)}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {showCollapseToggle && (
        <div className="border-t border-petrol-800 p-2">
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-petrol-200 hover:bg-petrol-800 hover:text-white ${
              collapsed ? "justify-center" : ""
            }`}
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            {!collapsed && <span>Colapsar menú</span>}
          </button>
        </div>
      )}
    </div>
  );
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      {/* Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden border-r border-petrol-800 transition-[width] duration-200 lg:block ${
          collapsed ? "w-[68px]" : "w-64"
        }`}
      >
        <SidebarContent collapsed={collapsed} onToggleCollapse={onToggleCollapse} showCollapseToggle />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button aria-label="Cerrar menú" onClick={onCloseMobile} className="absolute inset-0 bg-slate-900/40" />
          <div className="relative flex w-64 flex-col shadow-xl">
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Cerrar menú"
              className="absolute right-3 top-4 z-10 rounded-md p-1.5 text-petrol-200 hover:bg-petrol-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent collapsed={false} onNavigate={onCloseMobile} showCollapseToggle={false} />
          </div>
        </div>
      )}
    </>
  );
}

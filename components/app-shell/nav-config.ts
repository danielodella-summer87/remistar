import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  CalendarDays,
  Route,
  Users,
  IdCard,
  Car,
  FileText,
  Wallet,
  Banknote,
  Receipt,
  Wrench,
  Handshake,
  Star,
  BellRing,
  Settings,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Operación",
    items: [
      { label: "Dashboard", href: "/app", icon: LayoutDashboard },
      { label: "Agenda", href: "/app/agenda", icon: CalendarDays },
      { label: "Servicios", href: "/app/servicios", icon: Route },
    ],
  },
  {
    label: "Personas y recursos",
    items: [
      { label: "Clientes", href: "/app/clientes", icon: Users },
      { label: "Choferes", href: "/app/choferes", icon: IdCard },
      { label: "Vehículos", href: "/app/vehiculos", icon: Car },
    ],
  },
  {
    label: "Administración",
    items: [
      { label: "Facturación", href: "/app/facturacion", icon: FileText },
      { label: "Cobranza", href: "/app/cobranza", icon: Wallet },
      { label: "Liquidaciones", href: "/app/liquidaciones", icon: Banknote },
      { label: "Rendición de gastos", href: "/app/gastos", icon: Receipt },
    ],
  },
  {
    label: "Flota",
    items: [{ label: "Mantenimiento", href: "/app/mantenimiento", icon: Wrench }],
  },
  {
    label: "Comercial",
    items: [
      { label: "Oportunidades", href: "/app/oportunidades", icon: Handshake },
      { label: "Calidad", href: "/app/calidad", icon: Star },
    ],
  },
  {
    label: "Control",
    items: [
      { label: "Alertas", href: "/app/alertas", icon: BellRing },
      { label: "Configuración", href: "/app/configuracion", icon: Settings },
    ],
  },
];

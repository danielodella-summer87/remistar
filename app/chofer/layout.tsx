import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DriverShell } from "@/components/driver/DriverShell";

export const metadata: Metadata = {
  title: "Portal del chofer",
  description: "Remistar Intelligence — portal móvil de demostración para choferes.",
};

export default function ChoferLayout({ children }: { children: ReactNode }) {
  return <DriverShell>{children}</DriverShell>;
}

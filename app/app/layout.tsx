import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell/AppShell";

export const metadata: Metadata = {
  title: {
    default: "Panel interno",
    template: "%s · Remistar Intelligence",
  },
};

export default function InternalLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

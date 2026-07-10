import type { ReactNode } from "react";
import { DriverHeader } from "./DriverHeader";
import { DriverBottomNav } from "./DriverBottomNav";

export function DriverShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 sm:py-6">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-slate-50 sm:min-h-[calc(100vh-3rem)] sm:overflow-hidden sm:rounded-[2rem] sm:border sm:border-slate-200 sm:shadow-xl">
        <DriverHeader />
        <main className="flex-1 space-y-4 overflow-y-auto px-4 pb-6 pt-4">{children}</main>
        <DriverBottomNav />
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import { Container } from "./Container";

export function Section({
  children,
  className = "",
  alt = false,
}: {
  children: ReactNode;
  className?: string;
  alt?: boolean;
}) {
  return (
    <section className={`py-16 sm:py-20 ${alt ? "bg-slate-50" : "bg-white"} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-wider text-opgreen-600">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-base text-slate-600">{description}</p>}
    </div>
  );
}

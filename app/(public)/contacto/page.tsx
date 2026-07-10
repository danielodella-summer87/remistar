import type { Metadata } from "next";
import { Phone, Mail, MapPin } from "lucide-react";
import { Section, SectionHeading } from "@/components/public/Section";
import { ContactForm } from "@/components/public/ContactForm";
import { WhatsAppLink } from "@/components/public/WhatsAppLink";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contactá a Remistar para coordinar un traslado o consultar por el programa de empresas.",
};

export default function ContactoPage() {
  return (
    <Section>
      <SectionHeading eyebrow="Contacto" title="Escribinos y te respondemos a la brevedad" />
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Datos de contacto (demo)
            </p>
            <ul className="mt-3 space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-petrol-600" /> +598 2XXX XXXX
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-petrol-600" /> contacto@remistar.com.uy
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-petrol-600" /> Montevideo, Uruguay
              </li>
            </ul>
          </div>
          <WhatsAppLink className="w-full" />
          <p className="text-xs text-slate-500">
            Para coordinar un traslado con precio y disponibilidad, usá el formulario de{" "}
            <a href="/solicitar-traslado" className="font-medium text-petrol-700 underline underline-offset-2">
              Solicitar traslado
            </a>
            . Este formulario de contacto es para consultas generales.
          </p>
        </div>
      </div>
    </Section>
  );
}

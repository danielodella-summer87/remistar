import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-petrol-950 bg-petrol-900 text-petrol-100">
      <Container className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold text-white">
            Remistar<span className="text-opgreen-400">.</span>
          </p>
          <p className="mt-2 text-sm text-petrol-300">Movilidad y coordinación inteligente</p>
          <p className="mt-4 text-xs text-petrol-400">
            Sitio y datos de contacto de demostración. La información de esta página todavía no fue
            validada con la operación real de Remistar.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-petrol-400">Servicios</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/servicios" className="hover:text-white">Traslados al aeropuerto</Link></li>
            <li><Link href="/servicios" className="hover:text-white">Traslados corporativos</Link></li>
            <li><Link href="/servicios" className="hover:text-white">Viajes ejecutivos</Link></li>
            <li><Link href="/servicios" className="hover:text-white">Eventos</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-petrol-400">Empresa</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/nosotros" className="hover:text-white">Nosotros</Link></li>
            <li><Link href="/empresas" className="hover:text-white">Empresas</Link></li>
            <li><Link href="/flota" className="hover:text-white">Flota</Link></li>
            <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-petrol-400">Contacto (demo)</p>
          <ul className="mt-3 space-y-2 text-sm text-petrol-200">
            <li>+598 2XXX XXXX</li>
            <li>contacto@remistar.com.uy</li>
            <li>Montevideo, Uruguay</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-petrol-800 py-5">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-petrol-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Remistar Intelligence — prototipo demo, sin datos reales.</p>
          <p>Diseñado para presentar el proyecto en su etapa de Discovery.</p>
        </Container>
      </div>
    </footer>
  );
}

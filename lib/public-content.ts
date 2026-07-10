import {
  Plane,
  Building2,
  Briefcase,
  PartyPopper,
  Map,
  Clock,
  CalendarClock,
  Repeat,
  HeartHandshake,
  Radar,
  Award,
  Eye,
  ShieldCheck,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import type { ServiceType } from "@/lib/types";

export interface ServiceTypeContent {
  type: ServiceType;
  icon: LucideIcon;
  title: string;
  description: string;
  longDescription: string;
}

export const serviceTypesContent: ServiceTypeContent[] = [
  {
    type: "aeropuerto",
    icon: Plane,
    title: "Aeropuerto",
    description: "Salidas y llegadas coordinadas con seguimiento de vuelo, para no llegar tarde ni esperar de más.",
    longDescription:
      "Coordinamos el horario de salida en base al vuelo real, no a un horario fijo. El chofer confirma la ruta y el punto de encuentro con anticipación, para que el traslado hacia o desde el Aeropuerto de Carrasco sea predecible.",
  },
  {
    type: "corporativo",
    icon: Building2,
    title: "Traslados corporativos",
    description: "Traslados diarios para ejecutivos y equipos, con chofer asignado y facturación centralizada.",
    longDescription:
      "Pensado para empresas que necesitan mover personas de forma recurrente: oficinas, reuniones, visitas a clientes. Se coordina con la empresa, no con cada pasajero por separado, y se factura de forma centralizada.",
  },
  {
    type: "ejecutivo",
    icon: Briefcase,
    title: "Viajes ejecutivos",
    description: "Vehículos y choferes seleccionados para reuniones, clientes y agendas exigentes.",
    longDescription:
      "Para cuando la puntualidad y la presentación importan tanto como el trayecto: reuniones, visitas de clientes o traslados individuales de alto perfil.",
  },
  {
    type: "evento",
    icon: PartyPopper,
    title: "Eventos",
    description: "Coordinación de múltiples traslados simultáneos para conferencias, lanzamientos y celebraciones.",
    longDescription:
      "Organizamos varios vehículos y choferes en simultáneo para eventos con múltiples invitados, coordinando horarios de llegada y salida como un solo operativo.",
  },
  {
    type: "interior",
    icon: Map,
    title: "Viajes al interior",
    description: "Traslados de larga distancia dentro de Uruguay, con vehículo y chofer preparados para el trayecto.",
    longDescription:
      "Viajes fuera de Montevideo, con un vehículo y un chofer preparados específicamente para trayectos largos, incluyendo paradas y tiempos de descanso cuando corresponde.",
  },
  {
    type: "por_hora",
    icon: Clock,
    title: "Servicios por hora",
    description: "Un vehículo a disposición durante el tiempo que necesites, con un solo punto de coordinación.",
    longDescription:
      "Para agendas con varias paradas o tiempos inciertos: el vehículo queda a disposición durante el período contratado, sin tener que coordinar cada tramo por separado.",
  },
  {
    type: "programado",
    icon: CalendarClock,
    title: "Traslados programados",
    description: "Viajes recurrentes con horario fijo, sin tener que coordinar cada vez.",
    longDescription:
      "Traslados que se repiten en el tiempo — un mismo horario, un mismo trayecto — y que quedan coordinados una sola vez.",
  },
  {
    type: "frecuente",
    icon: Repeat,
    title: "Pasajeros frecuentes",
    description: "Beneficios y atención prioritaria para quienes viajan con Remistar de forma habitual.",
    longDescription:
      "Reconocemos a quienes viajan con nosotros de forma habitual con atención prioritaria y una coordinación más ágil, basada en el historial de viajes.",
  },
];

export const whyItems = [
  { icon: HeartHandshake, title: "Atención personalizada", description: "Un mismo equipo coordina cada viaje, conoce tus preferencias y responde rápido." },
  { icon: Radar, title: "Coordinación", description: "Cada traslado se planifica cruzando agenda, disponibilidad de choferes y estado real de la flota." },
  { icon: Award, title: "Experiencia", description: "Trayectoria trasladando ejecutivos, empresas y eventos en Montevideo y el interior." },
  { icon: Eye, title: "Seguimiento", description: "Confirmación de cada servicio antes, durante y después del viaje." },
  { icon: ShieldCheck, title: "Vehículos controlados", description: "Flota con mantenimiento, documentación y seguros al día, verificados antes de asignar." },
  { icon: UserCheck, title: "Conductores seleccionados", description: "Choferes evaluados por puntualidad, trato y conocimiento del recorrido." },
];

export const howItWorksSteps = [
  { title: "Solicitás", description: "Nos contás el traslado que necesitás: origen, destino, fecha y pasajeros." },
  { title: "Confirmamos", description: "Te confirmamos disponibilidad, precio y detalles antes de coordinar nada." },
  { title: "Asignamos", description: "Elegimos el chofer y el vehículo más adecuados para tu viaje." },
  { title: "Acompañamos", description: "Seguimos el servicio de principio a fin, listos para resolver cualquier imprevisto." },
  { title: "Finalizamos", description: "Cerramos el viaje y, si corresponde, lo sumamos a tu facturación." },
];

export const empresaFeatures = [
  {
    title: "Cuentas corporativas",
    description: "Condiciones comerciales propias, acordadas una sola vez y aplicadas a cada traslado de la empresa.",
  },
  {
    title: "Facturación centralizada",
    description: "Un único proceso de facturación por período, en lugar de coordinar cada servicio de forma aislada.",
  },
  {
    title: "Gestión de pasajeros",
    description: "Empleados y visitas habilitados para solicitar traslados dentro de la cuenta de la empresa.",
  },
  {
    title: "Reservas recurrentes",
    description: "Traslados que se repiten en el tiempo, coordinados una sola vez.",
  },
  {
    title: "Seguimiento",
    description: "Visibilidad del estado de cada traslado del equipo, no solo del propio.",
  },
  {
    title: "Atención prioritaria",
    description: "Respuesta más rápida ante cambios, imprevistos o solicitudes de último momento.",
  },
];

import type { Recommendation } from "@/lib/types";
import { services } from "./services";
import { vehicles, drivers } from "./fleet";
import { clients } from "./clients";
import { expenseReports, settlements } from "./settlements";
import { opportunities } from "./commercial";
import { daysFromToday } from "@/lib/format";

/**
 * Motor de recomendaciones demo: reglas simples sobre los datos mock, SIN IA real.
 * Cada recomendación explica qué detectó y por qué, según el principio del proyecto
 * de que los motores inteligentes deben explicar su criterio y nunca decidir solos.
 */
export function getRecommendations(): Recommendation[] {
  const items: Recommendation[] = [];

  for (const s of services) {
    if (s.status === "pendiente" && !s.driverId) {
      items.push({
        id: `rec-svc-${s.id}`,
        title: `Servicio ${s.code} sin chofer asignado`,
        detectedFrom: `Servicio ${s.code} — ${s.origin} → ${s.destination}`,
        reason: `Está programado para ${s.date} ${s.time} y todavía no tiene chofer ni vehículo.`,
        priority: s.risk === "alto" ? "alta" : "media",
        suggestedAction: "Revisar disponibilidad y asignar chofer y vehículo.",
        missingData: !s.vehicleId ? "Falta también el vehículo" : undefined,
        isDemo: true,
      });
    }
  }

  for (const v of vehicles) {
    const daysToService = daysFromToday(v.nextServiceDate);
    if (v.status !== "mantenimiento" && v.status !== "fuera_de_servicio" && daysToService <= 7) {
      items.push({
        id: `rec-veh-service-${v.id}`,
        title: `Service próximo — ${v.brand} ${v.model} (${v.plate})`,
        detectedFrom: `Vehículo ${v.plate}`,
        reason:
          daysToService <= 0
            ? "El kilometraje/fecha de service ya se alcanzó."
            : `Faltan ${daysToService} día(s) para el próximo service.`,
        priority: daysToService <= 0 ? "alta" : "media",
        suggestedAction: "Coordinar turno de taller antes de seguir asignando el vehículo.",
        isDemo: true,
      });
    }
  }

  for (const c of clients) {
    if (c.balance < -10000) {
      items.push({
        id: `rec-client-${c.id}`,
        title: `Cliente con saldo deudor relevante — ${c.name}`,
        detectedFrom: `Cuenta corriente de ${c.name}`,
        reason: `El saldo deudor es de ${Math.abs(c.balance)} (demo), por encima del umbral habitual.`,
        priority: "media",
        suggestedAction: "Revisar facturas vencidas y contactar para acordar un pago.",
        isDemo: true,
      });
    }
  }

  for (const e of expenseReports) {
    if (e.status === "pendiente_comprobante") {
      const driver = drivers.find((d) => d.id === e.driverId);
      items.push({
        id: `rec-exp-${e.id}`,
        title: `Gasto sin comprobante — ${driver?.name ?? "chofer"}`,
        detectedFrom: `Gasto de ${e.category} presentado el ${e.date}`,
        reason: "El gasto fue cargado pero todavía no tiene comprobante adjunto.",
        priority: "media",
        suggestedAction: "Solicitar el comprobante antes de incluirlo en la liquidación.",
        isDemo: true,
      });
    }
  }

  for (const st of settlements) {
    if (st.status === "lista_para_pagar" || st.status === "aprobada") {
      const driver = drivers.find((d) => d.id === st.driverId);
      items.push({
        id: `rec-set-${st.id}`,
        title: `Liquidación lista para revisar — ${driver?.name ?? "chofer"}`,
        detectedFrom: `Liquidación del período ${st.periodLabel}`,
        reason:
          st.status === "aprobada"
            ? "Ya fue aprobada y está en condiciones de pagarse."
            : "Está lista para pagar; falta solo ejecutar el pago.",
        priority: "media",
        suggestedAction: "Confirmar el pago y registrar el comprobante.",
        isDemo: true,
      });
    }
  }

  for (const o of opportunities) {
    if ((o.stage === "nuevo" || o.stage === "contactado") && o.probability <= 40) {
      items.push({
        id: `rec-opp-${o.id}`,
        title: `Oportunidad requiere seguimiento — ${o.company}`,
        detectedFrom: `Oportunidad "${o.title}"`,
        reason: `Etapa "${o.stage}" con probabilidad estimada de ${o.probability}% y sin avance reciente.`,
        priority: "baja",
        suggestedAction: o.nextAction,
        isDemo: true,
      });
    }
  }

  // Detección simple de superposición: mismo chofer, mismo día, dos servicios activos.
  const byDriverDay = new Map<string, typeof services>();
  for (const s of services) {
    if (!s.driverId || s.status === "cancelado" || s.status === "finalizado") continue;
    const key = `${s.driverId}-${s.date}`;
    const list = byDriverDay.get(key) ?? [];
    list.push(s);
    byDriverDay.set(key, list);
  }
  for (const [key, list] of byDriverDay) {
    if (list.length > 1) {
      const driver = drivers.find((d) => d.id === list[0].driverId);
      items.push({
        id: `rec-conflict-${key}`,
        title: `Posible superposición de agenda — ${driver?.name ?? "chofer"}`,
        detectedFrom: `${list.length} servicios el ${list[0].date}`,
        reason: `El chofer tiene ${list.length} servicios activos el mismo día: ${list
          .map((s) => `${s.code} (${s.time})`)
          .join(", ")}.`,
        priority: "alta",
        suggestedAction: "Verificar horarios y tiempos de traslado entre servicios.",
        isDemo: true,
      });
    }
  }

  return items;
}

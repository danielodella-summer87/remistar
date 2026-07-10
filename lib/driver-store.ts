"use client";

import { useSyncExternalStore } from "react";
import type {
  DriverAvailabilityStatus,
  DriverServiceStatus,
  DriverServiceHistoryEntry,
  DriverExpenseDraft,
  DriverIncident,
  DriverPaymentConfirmation,
} from "@/lib/types";

export { DEMO_DRIVER_ID } from "@/lib/driver-constants";

const STORAGE_KEY = "remistar:driver-demo:v1";

export interface VehicleDemoUpdates {
  mileage?: number;
  fuelLevel?: "lleno" | "tres_cuartos" | "mitad" | "un_cuarto" | "reserva";
  unavailable?: boolean;
  unavailableReason?: string;
}

export interface DriverDemoState {
  version: 1;
  availability: DriverAvailabilityStatus;
  serviceStatus: Record<string, DriverServiceStatus>;
  serviceHistory: Record<string, DriverServiceHistoryEntry[]>;
  expenseDrafts: DriverExpenseDraft[];
  incidentDrafts: DriverIncident[];
  paymentConfirmations: DriverPaymentConfirmation[];
  vehicle: VehicleDemoUpdates;
}

const DEFAULT_STATE: DriverDemoState = {
  version: 1,
  availability: "disponible",
  serviceStatus: {},
  serviceHistory: {},
  expenseDrafts: [],
  incidentDrafts: [],
  paymentConfirmations: [],
  vehicle: {},
};

let cached: DriverDemoState | null = null;
const listeners = new Set<() => void>();

function read(): DriverDemoState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  if (cached) return cached;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cached = raw ? { ...DEFAULT_STATE, ...(JSON.parse(raw) as Partial<DriverDemoState>) } : DEFAULT_STATE;
  } catch {
    cached = DEFAULT_STATE;
  }
  return cached;
}

function write(next: DriverDemoState) {
  cached = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage no disponible (modo privado, etc.) — se ignora, el estado sigue en memoria.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getServerSnapshot(): DriverDemoState {
  return DEFAULT_STATE;
}

/** Hook de lectura reactiva del estado demo del chofer, hidratación-segura. */
export function useDriverDemoState(): DriverDemoState {
  return useSyncExternalStore(subscribe, read, getServerSnapshot);
}

function nowLabel(): string {
  return new Date().toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit" });
}

function appendHistory(
  state: DriverDemoState,
  serviceId: string,
  status: DriverServiceStatus,
  note?: string
): DriverDemoState {
  const entry: DriverServiceHistoryEntry = { status, at: `Hoy ${nowLabel()}`, note };
  const existing = state.serviceHistory[serviceId] ?? [];
  return {
    ...state,
    serviceStatus: { ...state.serviceStatus, [serviceId]: status },
    serviceHistory: { ...state.serviceHistory, [serviceId]: [...existing, entry] },
  };
}

export const driverActions = {
  setAvailability(status: DriverAvailabilityStatus) {
    write({ ...read(), availability: status });
  },

  setServiceStatus(serviceId: string, status: DriverServiceStatus, note?: string) {
    write(appendHistory(read(), serviceId, status, note));
  },

  rejectService(serviceId: string, reason: string) {
    write(appendHistory(read(), serviceId, "rechazado", reason));
  },

  /** Descarta el overlay de este servicio puntual; vuelve a calcularse desde el estado administrativo. */
  resetServiceStatus(serviceId: string) {
    const state = read();
    const serviceStatus = { ...state.serviceStatus };
    const serviceHistory = { ...state.serviceHistory };
    delete serviceStatus[serviceId];
    delete serviceHistory[serviceId];
    write({ ...state, serviceStatus, serviceHistory });
  },

  requestExtraWait(serviceId: string, minutes: number, reason?: string) {
    const state = read();
    const note = `Espera adicional informada: ${minutes} min${reason ? ` — ${reason}` : ""}`;
    const current = state.serviceStatus[serviceId];
    // No cambia de estado: solo deja constancia en el historial del servicio.
    if (current) {
      write(appendHistory(state, serviceId, current, note));
    }
  },

  addExpenseDraft(draft: DriverExpenseDraft) {
    const state = read();
    write({ ...state, expenseDrafts: [draft, ...state.expenseDrafts] });
  },

  addIncident(incident: DriverIncident) {
    const state = read();
    write({ ...state, incidentDrafts: [incident, ...state.incidentDrafts] });
  },

  confirmPayment(confirmation: DriverPaymentConfirmation) {
    const state = read();
    write({ ...state, paymentConfirmations: [confirmation, ...state.paymentConfirmations] });
  },

  updateVehicle(updates: VehicleDemoUpdates) {
    const state = read();
    write({ ...state, vehicle: { ...state.vehicle, ...updates } });
  },

  resetDemo() {
    write(DEFAULT_STATE);
  },
};

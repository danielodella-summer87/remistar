/**
 * Modelos preliminares de Remistar Intelligence.
 *
 * Estas interfaces reflejan las hipótesis documentadas en docs/conocimiento/REMISTAR-DICCIONARIO-INICIAL.md
 * y docs/producto/REMISTAR-MODULOS-V0.md. NO son un esquema de base de datos definitivo: son la forma
 * de los datos mock usados en este prototipo, pensada para ser fácil de reemplazar por datos reales
 * una vez validado el Discovery con Gonzalo.
 */

export type ID = string;

// ---------------------------------------------------------------------------
// Clientes y pasajeros
// ---------------------------------------------------------------------------

export type ClientType = "particular" | "corporativo";

export interface Client {
  id: ID;
  name: string;
  type: ClientType;
  contactName?: string;
  email: string;
  phone: string;
  document: string;
  address: string;
  since: string;
  totalServices: number;
  balance: number;
  paymentTerms?: string;
  notes?: string;
  isDemo: true;
}

export interface Passenger {
  id: ID;
  name: string;
  clientId: ID;
  phone?: string;
  email?: string;
  isFrequent: boolean;
  isDemo: true;
}

// ---------------------------------------------------------------------------
// Choferes y vehículos
// ---------------------------------------------------------------------------

export type DriverStatus = "disponible" | "en_servicio" | "descanso" | "inactivo";
export type VehicleOwnership = "propio" | "remistar";
export type PaymentScheme = "comision" | "jornal" | "tarifa_fija";

export interface Driver {
  id: ID;
  name: string;
  phone: string;
  status: DriverStatus;
  usualVehicleId?: ID;
  rating: number;
  punctuality: number;
  hoursThisWeek: number;
  joinedAt: string;
  licenseExpiry: string;
  backgroundCheckExpiry: string;
  healthCertExpiry: string;
  pendingSettlementAmount: number;
  pendingExpensesCount: number;
  vehicleOwnership: VehicleOwnership;
  paymentScheme: PaymentScheme;
  isDemo: true;
}

export type VehicleStatus =
  | "disponible"
  | "reservado"
  | "en_servicio"
  | "mantenimiento"
  | "fuera_de_servicio";

export type VehicleCategory = "sedan_ejecutivo" | "van" | "suv" | "minibus";

export interface Vehicle {
  id: ID;
  plate: string;
  brand: string;
  model: string;
  year: number;
  category: VehicleCategory;
  capacity: number;
  status: VehicleStatus;
  mileage: number;
  nextServiceKm: number;
  nextServiceDate: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  usualDriverId?: ID;
  estimatedCostPerKm: number;
  demoLocation: string;
  isDemo: true;
}

// ---------------------------------------------------------------------------
// Servicios y cotizaciones
// ---------------------------------------------------------------------------

export type ServiceType =
  | "aeropuerto"
  | "corporativo"
  | "ejecutivo"
  | "evento"
  | "interior"
  | "por_hora"
  | "programado"
  | "frecuente";

export type ServiceStatus =
  | "pendiente"
  | "confirmado"
  | "asignado"
  | "en_curso"
  | "finalizado"
  | "cancelado";

export type ServiceRisk = "bajo" | "medio" | "alto";

export interface Service {
  id: ID;
  code: string;
  type: ServiceType;
  status: ServiceStatus;
  risk: ServiceRisk;
  riskReason?: string;
  date: string;
  time: string;
  origin: string;
  destination: string;
  clientId: ID;
  passengerId?: ID;
  driverId?: ID;
  vehicleId?: ID;
  amount: number;
  driverPayoutCriteria: string;
  driverPayoutAmount?: number;
  estimatedCost: number;
  notes?: string;
  stops?: string[];
  passengerCount?: number;
  luggageNotes?: string;
  paymentMethod?: string;
  specialInstructions?: string;
  isDemo: true;
}

export type QuoteStatus = "cotizado" | "aceptado" | "rechazado" | "vencido";

export interface Quote {
  id: ID;
  requesterName: string;
  clientName: string;
  type: ServiceType;
  amount: number;
  status: QuoteStatus;
  createdAt: string;
  isDemo: true;
}

// ---------------------------------------------------------------------------
// Facturación y cobranza
// ---------------------------------------------------------------------------

export type InvoiceStatus =
  | "pendiente"
  | "emitida"
  | "vencida"
  | "pagada_parcial"
  | "pagada"
  | "anulada";

export interface Invoice {
  id: ID;
  number: string;
  clientId: ID;
  serviceIds: ID[];
  amount: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  hasRefacturableExpenses: boolean;
  isDemo: true;
}

export type CollectionType = "pago_total" | "pago_parcial" | "promesa_pago";
export type CollectionMethod = "efectivo" | "transferencia" | "tarjeta";

export interface Collection {
  id: ID;
  invoiceId: ID;
  clientId: ID;
  amount: number;
  date: string;
  method: CollectionMethod;
  type: CollectionType;
  notes?: string;
  isDemo: true;
}

// ---------------------------------------------------------------------------
// Liquidaciones y rendición de gastos de choferes
// ---------------------------------------------------------------------------

export type SettlementStatus =
  | "borrador"
  | "pendiente_rendiciones"
  | "pendiente_revision"
  | "observada"
  | "aprobada"
  | "lista_para_pagar"
  | "pagada_parcial"
  | "pagada"
  | "cerrada"
  | "reabierta";

export interface DriverSettlement {
  id: ID;
  driverId: ID;
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
  serviceIds: ID[];
  serviceAmount: number;
  approvedExpensesAmount: number;
  rejectedExpensesAmount: number;
  advancesAmount: number;
  adjustmentsAmount: number;
  finalBalance: number;
  status: SettlementStatus;
  paymentDate?: string;
  paymentMethod?: string;
  receiptConfirmed: boolean;
  isDemo: true;
}

export type ExpenseCategory =
  | "peaje"
  | "combustible"
  | "estacionamiento"
  | "desayuno"
  | "almuerzo_cena"
  | "alojamiento"
  | "lavado"
  | "reparacion_menor"
  | "compra_urgente"
  | "otro";

export type ExpenseStatus =
  | "pendiente_comprobante"
  | "pendiente_revision"
  | "observado"
  | "aprobado"
  | "aprobado_parcial"
  | "rechazado"
  | "incluido_liquidacion"
  | "reintegrado";

export interface ExpenseReport {
  id: ID;
  driverId: ID;
  serviceId?: ID;
  vehicleId?: ID;
  clientId?: ID;
  category: ExpenseCategory;
  amount: number;
  approvedAmount?: number;
  date: string;
  hasReceipt: boolean;
  requiredPreApproval: boolean;
  preApproved?: boolean;
  status: ExpenseStatus;
  refacturable: boolean;
  possibleDuplicate?: boolean;
  notes?: string;
  settlementId?: ID;
  currency?: "UYU" | "USD";
  provider?: string;
  paymentMethod?: string;
  reason?: string;
  isDemo: true;
}

// ---------------------------------------------------------------------------
// Mantenimiento
// ---------------------------------------------------------------------------

export type MaintenanceType = "preventivo" | "correctivo" | "service";
export type MaintenanceStatus = "programado" | "en_taller" | "completado" | "atrasado";

export interface MaintenanceRecord {
  id: ID;
  vehicleId: ID;
  type: MaintenanceType;
  description: string;
  status: MaintenanceStatus;
  scheduledDate: string;
  completedDate?: string;
  workshop: string;
  cost?: number;
  warrantyUntil?: string;
  isDemo: true;
}

// ---------------------------------------------------------------------------
// Comercial: oportunidades y calidad
// ---------------------------------------------------------------------------

export type OpportunityType =
  | "convenio_hotel"
  | "empresa"
  | "evento"
  | "clinica"
  | "cliente_frecuente"
  | "agencia_turismo";

export type OpportunityStage =
  | "nuevo"
  | "contactado"
  | "propuesta"
  | "negociacion"
  | "ganado"
  | "perdido";

export interface CommercialOpportunity {
  id: ID;
  title: string;
  company: string;
  type: OpportunityType;
  estimatedValue: number;
  stage: OpportunityStage;
  nextAction: string;
  source: string;
  probability: number;
  owner: string;
  isDemo: true;
}

export interface Survey {
  id: ID;
  serviceId: ID;
  clientId: ID;
  overallScore: number;
  punctualityScore: number;
  driverScore: number;
  vehicleScore: number;
  comment?: string;
  date: string;
  hasComplaint: boolean;
  isDemo: true;
}

// ---------------------------------------------------------------------------
// Alertas
// ---------------------------------------------------------------------------

export type AlertModule =
  | "operacion"
  | "mantenimiento"
  | "documentacion"
  | "cobranza"
  | "liquidaciones"
  | "gastos"
  | "calidad"
  | "comercial";

export type AlertSeverity = "critica" | "alta" | "media" | "baja";
export type AlertStatus = "abierta" | "en_revision" | "resuelta";

export interface Alert {
  id: ID;
  module: AlertModule;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  description: string;
  relatedEntity?: string;
  suggestedAction: string;
  responsible: string;
  createdAt: string;
  isDemo: true;
}

// ---------------------------------------------------------------------------
// Portal del chofer (demo — estado local, sin backend)
// ---------------------------------------------------------------------------

/** Alias semántico: la disponibilidad que el chofer declara es el mismo dominio que DriverStatus. */
export type DriverAvailabilityStatus = DriverStatus;

/**
 * Estado operativo de un servicio visto por el chofer (distinto del ServiceStatus administrativo).
 * Se guarda como overlay en localStorage, nunca sobrescribe el Service.status real.
 */
export type DriverServiceStatus =
  | "asignado"
  | "pendiente_aceptacion"
  | "aceptado"
  | "rechazado"
  | "en_camino"
  | "en_origen"
  | "pasajero_a_bordo"
  | "en_viaje"
  | "finalizado"
  | "pendiente_rendicion"
  | "cerrado";

export interface DriverServiceHistoryEntry {
  status: DriverServiceStatus;
  at: string;
  note?: string;
}

export type DriverIncidentType =
  | "mecanico"
  | "accidente"
  | "atraso"
  | "pasajero_ausente"
  | "cambio_recorrido"
  | "problema_pago"
  | "problema_cliente"
  | "equipaje_no_informado"
  | "otro";

export type DriverIncidentSeverity = "baja" | "media" | "alta";
export type DriverIncidentStatus = "reportada" | "en_revision" | "resuelta" | "cerrada";

export interface DriverIncident {
  id: ID;
  driverId: ID;
  serviceId?: ID;
  vehicleId?: ID;
  type: DriverIncidentType;
  severity: DriverIncidentSeverity;
  description: string;
  actionTaken?: string;
  canContinue?: boolean;
  needsImmediateAssistance?: boolean;
  mileage?: number;
  photoDemoName?: string;
  status: DriverIncidentStatus;
  createdAt: string;
  isDemo: true;
}

/** Gasto cargado desde el portal del chofer. Misma forma que ExpenseReport (se integra al mismo listado). */
export type DriverExpenseDraft = ExpenseReport;

export interface DriverPaymentConfirmation {
  id: ID;
  settlementId: ID;
  confirmedAt: string;
  note?: string;
  isDemo: true;
}

// ---------------------------------------------------------------------------
// Asistente operativo (recomendaciones basadas en reglas mock, sin IA real)
// ---------------------------------------------------------------------------

export type RecommendationPriority = "alta" | "media" | "baja";

export interface Recommendation {
  id: ID;
  title: string;
  detectedFrom: string;
  reason: string;
  priority: RecommendationPriority;
  suggestedAction: string;
  missingData?: string;
  isDemo: true;
}

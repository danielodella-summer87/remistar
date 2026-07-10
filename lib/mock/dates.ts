function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/** Fecha ISO (YYYY-MM-DD) relativa a hoy, para que los datos demo se mantengan siempre vigentes. */
export function isoDate(offsetDays: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

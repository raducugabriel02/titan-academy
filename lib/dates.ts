// Zilele calendaristice din aplicație sunt zile LOCALE (ora utilizatorului).
// Nu folosi toISOString() pentru date de zi — returnează ziua UTC, care după
// miezul nopții (până la 02:00–03:00 ora României) e ziua precedentă.

export function toLocalDateStr(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

// Ziua locală pentru un timestamp ISO (ex: logged_at din baza de date).
export function localDayOf(iso: string): string {
  return toLocalDateStr(new Date(iso));
}

// Utility functions for handling dates correctly across timezones

/**
 * Get a local date string in YYYY-MM-DD format
 * This avoids timezone issues with toISOString() which returns UTC dates
 */
export function getLocalDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parse a date string (YYYY-MM-DD) as local midnight
 * This ensures consistent date handling regardless of timezone
 */
export function parseLocalDate(dateString: string): Date {
  // Append T00:00:00 to parse as local midnight instead of UTC
  return new Date(`${dateString}T00:00:00`);
}

/**
 * Check if a date is today (local timezone)
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is in the past (local timezone)
 */
export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
}

const priceFormatter = new Intl.NumberFormat("ko-KR");

/** 380000 -> "380,000원" */
export function formatPrice(price: number): string {
  return `${priceFormatter.format(price)}원`;
}

/** 150 -> "2시간 30분", 120 -> "2시간", 45 -> "45분" */
export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/** Formats a Date as a local-time "YYYY-MM-DD" string. */
export function toLocalDateString(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** Returns a new Date shifted by the given number of local calendar days. */
export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

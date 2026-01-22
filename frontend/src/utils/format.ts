import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM dd, yyyy");
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM dd, yyyy HH:mm");
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatCurrency(
  amount: number,
  currency: string = "INR",
): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case "APPROVED":
      return "text-success-600 bg-success-50 dark:bg-success-500/10";
    case "PENDING":
      return "text-warning-600 bg-warning-50 dark:bg-warning-500/10";
    case "FLAGGED":
      return "text-warning-600 bg-warning-50 dark:bg-warning-500/10";
    case "BLOCKED":
      return "text-danger-600 bg-danger-50 dark:bg-danger-500/10";
    default:
      return "text-surface-600 bg-surface-100 dark:bg-surface-700";
  }
}

export function getRiskColor(score: number): string {
  if (score < 30) return "text-success-600";
  if (score < 60) return "text-warning-600";
  return "text-danger-600";
}

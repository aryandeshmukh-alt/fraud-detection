import { cn } from "@/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) {
  const variants = {
    default:
      "bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-300",
    success:
      "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400",
    warning:
      "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400",
    danger:
      "bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-400",
    info: "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400",
  };

  const sizes = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  );
}

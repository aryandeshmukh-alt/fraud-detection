import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/utils";

interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Alert({
  variant = "info",
  title,
  children,
  className,
}: AlertProps) {
  const variants = {
    info: {
      container:
        "bg-primary-50 border-primary-200 dark:bg-primary-500/10 dark:border-primary-500/20",
      icon: "text-primary-600 dark:text-primary-400",
      title: "text-primary-800 dark:text-primary-300",
      text: "text-primary-700 dark:text-primary-400",
    },
    success: {
      container:
        "bg-success-50 border-success-200 dark:bg-success-500/10 dark:border-success-500/20",
      icon: "text-success-600 dark:text-success-400",
      title: "text-success-800 dark:text-success-300",
      text: "text-success-700 dark:text-success-400",
    },
    warning: {
      container:
        "bg-warning-50 border-warning-200 dark:bg-warning-500/10 dark:border-warning-500/20",
      icon: "text-warning-600 dark:text-warning-400",
      title: "text-warning-800 dark:text-warning-300",
      text: "text-warning-700 dark:text-warning-400",
    },
    error: {
      container:
        "bg-danger-50 border-danger-200 dark:bg-danger-500/10 dark:border-danger-500/20",
      icon: "text-danger-600 dark:text-danger-400",
      title: "text-danger-800 dark:text-danger-300",
      text: "text-danger-700 dark:text-danger-400",
    },
  };

  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle,
  };

  const Icon = icons[variant];
  const styles = variants[variant];

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border p-4",
        styles.container,
        className,
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", styles.icon)} />
      <div className="flex-1">
        {title && (
          <h4 className={cn("font-medium mb-1", styles.title)}>{title}</h4>
        )}
        <div className={cn("text-sm", styles.text)}>{children}</div>
      </div>
    </div>
  );
}

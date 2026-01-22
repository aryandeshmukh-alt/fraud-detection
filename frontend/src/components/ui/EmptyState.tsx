import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="mb-4 rounded-full bg-surface-100 p-3 dark:bg-surface-800">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <Button className="mt-4" variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading the data.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4 rounded-full bg-danger-50 p-3 dark:bg-danger-500/10">
        <AlertCircle className="h-6 w-6 text-danger-600 dark:text-danger-400" />
      </div>
      <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100">
        {title}
      </h3>
      <p className="mt-1 text-sm text-surface-500 dark:text-surface-400 max-w-sm">
        {message}
      </p>
      {onRetry && (
        <Button
          className="mt-4"
          variant="outline"
          onClick={onRetry}
          leftIcon={<RefreshCw className="h-4 w-4" />}
        >
          Try again
        </Button>
      )}
    </div>
  );
}

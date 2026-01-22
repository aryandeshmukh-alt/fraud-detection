import { Component, type ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 p-4">
          <div className="max-w-md w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-danger-50 p-4 dark:bg-danger-500/10">
                <AlertCircle className="h-12 w-12 text-danger-600 dark:text-danger-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
              Something went wrong
            </h1>
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              An unexpected error occurred. Please try refreshing the page or
              contact support if the problem persists.
            </p>
            {this.state.error && (
              <div className="mb-6 p-4 rounded-lg bg-surface-100 dark:bg-surface-800 text-left">
                <p className="text-xs font-mono text-surface-600 dark:text-surface-400 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <Button
              onClick={this.handleReset}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

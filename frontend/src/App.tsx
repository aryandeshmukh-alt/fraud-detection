import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { PageLoader } from "@/components/ui";
import { AppLayout } from "@/components/layout";
import { ProtectedRoute, GuestRoute } from "@/components/guards";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useAuthStore } from "@/stores";

// Lazy load pages
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const TransactionsPage = lazy(
  () => import("@/pages/transactions/TransactionsPage"),
);
const NewTransactionPage = lazy(
  () => import("@/pages/transactions/NewTransactionPage"),
);
const NotificationsPage = lazy(
  () => import("@/pages/notifications/NotificationsPage"),
);
const AdminTransactionsPage = lazy(
  () => import("@/pages/admin/AdminTransactionsPage"),
);
const FraudEvaluationsPage = lazy(
  () => import("@/pages/admin/FraudEvaluationsPage"),
);
const AuditLogsPage = lazy(() => import("@/pages/admin/AuditLogsPage"));

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  const { fetchUser, isAuthenticated } = useAuthStore();

  // Fetch user on mount if we have a stored auth state
  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/transactions/new" element={<NewTransactionPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* Admin routes */}
          <Route
            path="/admin/transactions"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminTransactionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/fraud-evaluations"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <FraudEvaluationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AuditLogsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "var(--color-surface-900)",
                color: "var(--color-surface-50)",
                borderRadius: "0.75rem",
              },
              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

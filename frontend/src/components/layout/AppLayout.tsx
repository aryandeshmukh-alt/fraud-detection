import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  LayoutDashboard,
  CreditCard,
  Bell,
  Shield,
  FileText,
  Plus,
} from "lucide-react";
import { cn } from "@/utils";
import { useThemeStore, useUIStore, useAuthStore } from "@/stores";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Breadcrumbs from "./Breadcrumbs";
import CommandPalette from "./CommandPalette";
import { OfflineBanner } from "@/components/ui";

export default function AppLayout() {
  const navigate = useNavigate();
  const { sidebarCollapsed } = useThemeStore();
  const { openCommandPalette } = useUIStore();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.Role === "ADMIN";

  // Command palette items
  const commandItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "Go to dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      category: "Navigation",
      shortcut: "G D",
      action: () => navigate("/dashboard"),
    },
    {
      id: "transactions",
      title: "Transactions",
      description: "View your transactions",
      icon: <CreditCard className="h-4 w-4" />,
      category: "Navigation",
      shortcut: "G T",
      action: () => navigate("/transactions"),
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "View notifications",
      icon: <Bell className="h-4 w-4" />,
      category: "Navigation",
      shortcut: "G N",
      action: () => navigate("/notifications"),
    },
    {
      id: "new-transaction",
      title: "New Transaction",
      description: "Create a new transaction",
      icon: <Plus className="h-4 w-4" />,
      category: "Actions",
      shortcut: "N",
      action: () => navigate("/transactions/new"),
    },
    ...(isAdmin
      ? [
          {
            id: "admin-transactions",
            title: "All Transactions",
            description: "View all user transactions",
            icon: <CreditCard className="h-4 w-4" />,
            category: "Admin",
            action: () => navigate("/admin/transactions"),
          },
          {
            id: "fraud-evaluations",
            title: "Fraud Evaluations",
            description: "View fraud evaluations",
            icon: <Shield className="h-4 w-4" />,
            category: "Admin",
            action: () => navigate("/admin/fraud-evaluations"),
          },
          {
            id: "audit-logs",
            title: "Audit Logs",
            description: "View audit logs",
            icon: <FileText className="h-4 w-4" />,
            category: "Admin",
            action: () => navigate("/admin/audit-logs"),
          },
        ]
      : []),
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openCommandPalette();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openCommandPalette]);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Sidebar />
      <Header />

      <main
        className={cn(
          "pt-16 min-h-screen transition-all duration-300",
          sidebarCollapsed ? "pl-16" : "pl-64",
        )}
      >
        <div className="p-6">
          <Breadcrumbs className="mb-6" />
          <Outlet />
        </div>
      </main>

      <CommandPalette items={commandItems} />
      <OfflineBanner />
    </div>
  );
}

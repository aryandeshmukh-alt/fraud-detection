import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  Bell,
  Shield,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/utils";
import { useAuthStore, useThemeStore } from "@/stores";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: <Bell className="h-5 w-5" />,
  },
];

const adminNavItems: NavItem[] = [
  {
    label: "All Transactions",
    href: "/admin/transactions",
    icon: <CreditCard className="h-5 w-5" />,
    adminOnly: true,
  },
  {
    label: "Fraud Evaluations",
    href: "/admin/fraud-evaluations",
    icon: <Shield className="h-5 w-5" />,
    adminOnly: true,
  },
  {
    label: "Audit Logs",
    href: "/admin/audit-logs",
    icon: <FileText className="h-5 w-5" />,
    adminOnly: true,
  },
];

export default function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { sidebarCollapsed, toggleSidebar } = useThemeStore();
  const isAdmin = user?.Role === "ADMIN";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen flex-col border-r bg-white transition-all duration-300 dark:bg-surface-900",
        sidebarCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-surface-900 dark:text-surface-100">
              FraudGuard
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            "rounded-lg p-2 text-surface-400 hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800 dark:hover:text-surface-300 transition-colors",
            sidebarCollapsed && "mx-auto",
          )}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300"
                      : "text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100",
                    sidebarCollapsed && "justify-center px-2",
                  )
                }
                title={sidebarCollapsed ? item.label : undefined}
              >
                {item.icon}
                {!sidebarCollapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Admin section */}
        {isAdmin && (
          <>
            <div className="my-4 border-t" />
            {!sidebarCollapsed && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-surface-400">
                Admin
              </p>
            )}
            <ul className="space-y-1">
              {adminNavItems.map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300"
                          : "text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100",
                        sidebarCollapsed && "justify-center px-2",
                      )
                    }
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    {item.icon}
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      {/* User section */}
      <div className="border-t p-3">
        {!sidebarCollapsed && user && (
          <div className="mb-3 rounded-lg bg-surface-50 p-3 dark:bg-surface-800">
            <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
              {user.Name}
            </p>
            <p className="text-xs text-surface-500 truncate">{user.Email}</p>
          </div>
        )}
        <button
          onClick={() => logout()}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-surface-600 hover:bg-danger-50 hover:text-danger-700 dark:text-surface-400 dark:hover:bg-danger-500/10 dark:hover:text-danger-400 transition-colors",
            sidebarCollapsed && "justify-center px-2",
          )}
          title={sidebarCollapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

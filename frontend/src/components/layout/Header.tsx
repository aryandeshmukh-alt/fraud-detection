import { Search, Bell, Sun, Moon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/utils";
import { useThemeStore, useUIStore, useAuthStore } from "@/stores";
import { notificationsApi } from "@/api";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const { setTheme, resolvedTheme, sidebarCollapsed } = useThemeStore();
  const openCommandPalette = useUIStore((state) => state.openCommandPalette);

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread-notifications"],
    queryFn: notificationsApi.getUnreadCount,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-20 flex h-16 items-center justify-between border-b bg-white/80 backdrop-blur-md px-6 transition-all duration-300 dark:bg-surface-900/80",
        sidebarCollapsed ? "left-16" : "left-64",
      )}
    >
      {/* Search / Command Palette Trigger */}
      <button
        onClick={openCommandPalette}
        className="flex items-center gap-2 rounded-lg border bg-surface-50 px-3 py-2 text-sm text-surface-400 transition-colors hover:border-surface-300 hover:bg-surface-100 dark:bg-surface-800 dark:hover:bg-surface-700"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search or type a command...</span>
        <kbd className="ml-4 hidden rounded bg-surface-200 px-1.5 py-0.5 text-xs font-medium text-surface-500 dark:bg-surface-700 sm:inline">
          ⌘K
        </kbd>
      </button>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-surface-800 dark:hover:text-surface-300 transition-colors"
          title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* Notifications */}
        <a
          href="/notifications"
          className="relative rounded-lg p-2 text-surface-500 hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-surface-800 dark:hover:text-surface-300 transition-colors"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger-600 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </a>

        {/* User avatar */}
        {user && (
          <div className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700 dark:bg-primary-500/20 dark:text-primary-300">
            {user.Name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </div>
    </header>
  );
}

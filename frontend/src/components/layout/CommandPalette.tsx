import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, X } from "lucide-react";
import { cn } from "@/utils";
import { useUIStore } from "@/stores";

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  action: () => void;
  category?: string;
}

interface CommandPaletteProps {
  items: CommandItem[];
}

export default function CommandPalette({ items }: CommandPaletteProps) {
  const location = useLocation();
  const { isCommandPaletteOpen, closeCommandPalette } = useUIStore();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase()) ||
      item.category?.toLowerCase().includes(query.toLowerCase()),
  );

  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      const category = item.category || "Actions";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, CommandItem[]>,
  );

  const handleClose = useCallback(() => {
    closeCommandPalette();
    setQuery("");
    setSelectedIndex(0);
  }, [closeCommandPalette]);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      item.action();
      handleClose();
    },
    [handleClose],
  );

  // Close on location change
  useEffect(() => {
    handleClose();
  }, [location.pathname, handleClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isCommandPaletteOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(
            (prev) => (prev - 1 + filteredItems.length) % filteredItems.length,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            handleSelect(filteredItems[selectedIndex]);
          }
          break;
        case "Escape":
          handleClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isCommandPaletteOpen,
    filteredItems,
    selectedIndex,
    handleSelect,
    handleClose,
  ]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Palette */}
      <div
        className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl dark:bg-surface-900 overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="h-5 w-5 text-surface-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-surface-400"
            autoFocus
          />
          <button
            onClick={handleClose}
            className="p-1 rounded text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category} className="mb-2 last:mb-0">
              <div className="px-2 py-1.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">
                {category}
              </div>
              {categoryItems.map((item) => {
                const globalIndex = filteredItems.indexOf(item);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                      globalIndex === selectedIndex
                        ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300"
                        : "text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800",
                    )}
                  >
                    {item.icon && (
                      <span className="shrink-0 text-surface-400">
                        {item.icon}
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-surface-500 truncate">
                          {item.description}
                        </div>
                      )}
                    </div>
                    {item.shortcut && (
                      <kbd className="ml-auto shrink-0 rounded bg-surface-100 px-1.5 py-0.5 text-xs font-medium text-surface-500 dark:bg-surface-800">
                        {item.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="py-8 text-center text-sm text-surface-500">
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-4 py-2 text-xs text-surface-400">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default navigation items generator
export function useCommandItems() {
  const navigate = useNavigate();
  const { closeCommandPalette } = useUIStore();

  return [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "Go to dashboard",
      category: "Navigation",
      shortcut: "G D",
      action: () => {
        navigate("/dashboard");
        closeCommandPalette();
      },
    },
    {
      id: "transactions",
      title: "Transactions",
      description: "View transactions",
      category: "Navigation",
      shortcut: "G T",
      action: () => {
        navigate("/transactions");
        closeCommandPalette();
      },
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "View notifications",
      category: "Navigation",
      shortcut: "G N",
      action: () => {
        navigate("/notifications");
        closeCommandPalette();
      },
    },
    {
      id: "new-transaction",
      title: "New Transaction",
      description: "Create a new transaction",
      category: "Actions",
      shortcut: "N",
      action: () => {
        navigate("/transactions/new");
        closeCommandPalette();
      },
    },
  ];
}

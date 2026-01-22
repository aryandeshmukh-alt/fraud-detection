import { WifiOff } from "lucide-react";
import { useUIStore } from "@/stores";

export default function OfflineBanner() {
  const isOnline = useUIStore((state) => state.isOnline);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 animate-slide-up">
      <div className="flex items-center gap-2 rounded-full bg-surface-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-surface-100 dark:text-surface-900">
        <WifiOff className="h-4 w-4" />
        <span>You&apos;re offline. Check your connection.</span>
      </div>
    </div>
  );
}

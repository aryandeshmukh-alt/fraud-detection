import { create } from "zustand";

interface UIState {
  isOnline: boolean;
  isCommandPaletteOpen: boolean;
  isConfirmModalOpen: boolean;
  confirmModalConfig: {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    variant: "danger" | "warning" | "info";
    onConfirm: () => void;
  } | null;

  // Actions
  setOnline: (online: boolean) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  openConfirmModal: (config: UIState["confirmModalConfig"]) => void;
  closeConfirmModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  isCommandPaletteOpen: false,
  isConfirmModalOpen: false,
  confirmModalConfig: null,

  setOnline: (online: boolean) => set({ isOnline: online }),

  openCommandPalette: () => set({ isCommandPaletteOpen: true }),
  closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
  toggleCommandPalette: () =>
    set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

  openConfirmModal: (config) =>
    set({ isConfirmModalOpen: true, confirmModalConfig: config }),
  closeConfirmModal: () =>
    set({ isConfirmModalOpen: false, confirmModalConfig: null }),
}));

// Listen for online/offline events
if (typeof window !== "undefined") {
  window.addEventListener("online", () =>
    useUIStore.getState().setOnline(true),
  );
  window.addEventListener("offline", () =>
    useUIStore.getState().setOnline(false),
  );
}

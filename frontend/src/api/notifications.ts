import api from "./client";
import type {
  Notification,
  NotificationFilters,
  PaginatedResponse,
  ApiResponse,
} from "@/types";

export const notificationsApi = {
  getAll: async (
    filters?: NotificationFilters,
  ): Promise<PaginatedResponse<Notification>> => {
    const params = new URLSearchParams();
    if (filters?.unread_only) params.append("unread_only", "true");
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));

    const response = await api.get<ApiResponse<Notification[]>>(
      `/notifications?${params.toString()}`,
    );
    const notifications = response.data.data || [];
    return {
      data: notifications,
      total: notifications.length,
      page: filters?.page || 1,
      limit: filters?.limit || 10,
      total_pages: 1,
    };
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<ApiResponse<{ count: number }>>(
      "/notifications/unread-count",
    );
    return response.data.data?.count || 0;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch("/notifications/read-all");
  },
};

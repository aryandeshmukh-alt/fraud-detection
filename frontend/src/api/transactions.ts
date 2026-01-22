import api from "./client";
import type {
  Transaction,
  CreateTransactionRequest,
  TransactionFilters,
  PaginatedResponse,
  DashboardStats,
  ApiResponse,
} from "@/types";

export const transactionsApi = {
  create: async (data: CreateTransactionRequest): Promise<Transaction> => {
    const response = await api.post<ApiResponse<Transaction>>(
      "/transactions",
      data,
    );
    return response.data.data!;
  },

  getHistory: async (
    filters?: TransactionFilters,
  ): Promise<PaginatedResponse<Transaction>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.min_amount)
      params.append("min_amount", String(filters.min_amount));
    if (filters?.max_amount)
      params.append("max_amount", String(filters.max_amount));
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));

    const response = await api.get<ApiResponse<Transaction[]>>(
      `/transactions/history?${params.toString()}`,
    );
    // Backend returns array directly, wrap in paginated format
    const transactions = response.data.data || [];
    return {
      data: transactions,
      total: transactions.length,
      page: filters?.page || 1,
      limit: filters?.limit || 10,
      total_pages: 1,
    };
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get<ApiResponse<Transaction>>(
      `/transactions/${id}`,
    );
    return response.data.data!;
  },

  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>(
      "/transactions/stats",
    );
    return response.data.data!;
  },
};

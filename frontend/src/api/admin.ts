import api from "./client";
import type {
  Transaction,
  FraudEvaluation,
  AuditLog,
  PaginatedResponse,
  TransactionFilters,
  ApiResponse,
} from "@/types";

export const adminApi = {
  getTransactions: async (
    filters?: TransactionFilters,
  ): Promise<PaginatedResponse<Transaction>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));

    const response = await api.get<ApiResponse<Transaction[]>>(
      `/admin/transactions?${params.toString()}`,
    );
    const transactions = response.data.data || [];
    return {
      data: transactions,
      total: transactions.length,
      page: filters?.page || 1,
      limit: filters?.limit || 10,
      total_pages: 1,
    };
  },

  getFraudEvaluations: async (
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<FraudEvaluation>> => {
    const response = await api.get<ApiResponse<FraudEvaluation[]>>(
      `/admin/fraud-evaluations?page=${page}&limit=${limit}`,
    );
    const evaluations = response.data.data || [];
    return {
      data: evaluations,
      total: evaluations.length,
      page,
      limit,
      total_pages: 1,
    };
  },

  getAuditLogs: async (
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<AuditLog>> => {
    const response = await api.get<ApiResponse<AuditLog[]>>(
      `/admin/audit-logs?page=${page}&limit=${limit}`,
    );
    const logs = response.data.data || [];
    return {
      data: logs,
      total: logs.length,
      page,
      limit,
      total_pages: 1,
    };
  },

  updateTransactionStatus: async (
    id: string,
    status: string,
  ): Promise<Transaction> => {
    const response = await api.patch<ApiResponse<Transaction>>(
      `/admin/transactions/${id}/status`,
      { status },
    );
    return response.data.data!;
  },
};

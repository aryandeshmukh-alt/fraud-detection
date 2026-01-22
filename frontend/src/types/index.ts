// User types
export interface User {
  ID: string;
  Email: string;
  Name: string;
  Role: "USER" | "ADMIN";
  CreatedAt: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

// Transaction types
export interface Transaction {
  ID: string;
  UserID: string;
  Amount: number;
  Currency: string;
  Location: string;
  PaymentMethod: string;
  Status: "PENDING" | "APPROVED" | "FLAGGED" | "BLOCKED";
  RiskScore: number;
  DeviceID?: string;
  CreatedAt: string;
}

export interface CreateTransactionRequest {
  amount: number;
  currency: string;
  location: string;
  payment_method: string;
}

export interface TransactionFilters {
  status?: string;
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
  page?: number;
  limit?: number;
}

// Fraud evaluation types
export interface FraudEvaluation {
  ID: string;
  TransactionID: string;
  RiskScore: number;
  RiskFactors: RiskFactor[];
  Decision: string;
  EvaluatedAt: string;
}

export interface RiskFactor {
  Rule: string;
  Score: number;
  Reason: string;
}

// Notification types
export interface Notification {
  ID: string;
  UserID: string;
  Title: string;
  Message: string;
  Type: "INFO" | "WARNING" | "ALERT";
  IsRead: boolean;
  CreatedAt: string;
}

export interface NotificationFilters {
  unread_only?: boolean;
  page?: number;
  limit?: number;
}

// Audit log types
export interface AuditLog {
  ID: string;
  UserID: string;
  Action: string;
  EntityType: string;
  EntityID: string;
  OldValue?: string;
  NewValue?: string;
  IPAddress: string;
  UserAgent: string;
  CreatedAt: string;
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Dashboard stats
export interface DashboardStats {
  total_transactions: number;
  approved_transactions: number;
  flagged_transactions: number;
  blocked_transactions: number;
  total_amount: number;
  average_risk_score: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

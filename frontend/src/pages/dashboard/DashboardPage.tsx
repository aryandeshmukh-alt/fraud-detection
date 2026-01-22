import { useQuery } from "@tanstack/react-query";
import {
  CreditCard,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardSkeleton,
  Badge,
} from "@/components/ui";
import { transactionsApi } from "@/api";
import { useAuthStore } from "@/stores";
import { formatCurrency, formatNumber } from "@/utils";

// Mock data for charts (in real app, this would come from API)
const transactionTrend = [
  { name: "Mon", transactions: 45, amount: 125000 },
  { name: "Tue", transactions: 52, amount: 180000 },
  { name: "Wed", transactions: 38, amount: 95000 },
  { name: "Thu", transactions: 65, amount: 220000 },
  { name: "Fri", transactions: 48, amount: 150000 },
  { name: "Sat", transactions: 72, amount: 280000 },
  { name: "Sun", transactions: 55, amount: 175000 },
];

const statusDistribution = [
  { name: "Approved", value: 75, color: "#22c55e" },
  { name: "Pending", value: 15, color: "#f59e0b" },
  { name: "Flagged", value: 7, color: "#f97316" },
  { name: "Blocked", value: 3, color: "#ef4444" },
];

const riskDistribution = [
  { range: "0-20", count: 45 },
  { range: "21-40", count: 30 },
  { range: "41-60", count: 15 },
  { range: "61-80", count: 7 },
  { range: "81-100", count: 3 },
];

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions-history"],
    queryFn: () => transactionsApi.getHistory({ limit: 5 }),
  });

  // Calculate stats from transactions
  const stats = {
    totalTransactions: transactions?.total || 0,
    approvedCount:
      transactions?.data?.filter((t) => t.Status === "APPROVED").length || 0,
    flaggedCount:
      transactions?.data?.filter((t) => t.Status === "FLAGGED").length || 0,
    blockedCount:
      transactions?.data?.filter((t) => t.Status === "BLOCKED").length || 0,
    totalAmount: transactions?.data?.reduce((sum, t) => sum + t.Amount, 0) || 0,
    avgRiskScore: transactions?.data?.length
      ? transactions.data.reduce((sum, t) => sum + t.RiskScore, 0) /
        transactions.data.length
      : 0,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          Welcome back, {user?.Name?.split(" ")[0] || "User"}
        </h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">
          Here's an overview of your transaction activity
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Transactions"
          value={formatNumber(stats.totalTransactions)}
          change="+12.5%"
          changeType="positive"
          icon={<CreditCard className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Volume"
          value={formatCurrency(stats.totalAmount)}
          change="+8.2%"
          changeType="positive"
          icon={<TrendingUp className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Approved Rate"
          value={`${stats.totalTransactions ? ((stats.approvedCount / stats.totalTransactions) * 100).toFixed(1) : 0}%`}
          change="+2.1%"
          changeType="positive"
          icon={<CheckCircle className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Avg Risk Score"
          value={stats.avgRiskScore.toFixed(1)}
          change="-3.4%"
          changeType="negative"
          icon={<Shield className="h-5 w-5" />}
          isLoading={isLoading}
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Transaction trend */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={transactionTrend}>
                  <defs>
                    <linearGradient
                      id="colorAmount"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="name" stroke="#737373" fontSize={12} />
                  <YAxis stroke="#737373" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e5e5",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {statusDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-surface-600 dark:text-surface-400">
                      {item.name}
                    </span>
                    <span className="ml-auto text-sm font-medium text-surface-900 dark:text-surface-100">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk distribution and recent transactions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk score distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="range" stroke="#737373" fontSize={12} />
                  <YAxis stroke="#737373" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e5e5",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-12 animate-pulse rounded-lg bg-surface-100 dark:bg-surface-800"
                  />
                ))}
              </div>
            ) : transactions?.data?.length ? (
              <div className="space-y-3">
                {transactions.data.slice(0, 5).map((tx) => (
                  <div
                    key={tx.ID}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-surface-50 dark:hover:bg-surface-800"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          tx.Status === "APPROVED"
                            ? "bg-success-50 text-success-600 dark:bg-success-500/10"
                            : tx.Status === "BLOCKED"
                              ? "bg-danger-50 text-danger-600 dark:bg-danger-500/10"
                              : "bg-warning-50 text-warning-600 dark:bg-warning-500/10"
                        }`}
                      >
                        {tx.Status === "APPROVED" ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : tx.Status === "BLOCKED" ? (
                          <XCircle className="h-5 w-5" />
                        ) : (
                          <AlertTriangle className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                          {tx.PaymentMethod} • {tx.Location}
                        </p>
                        <p className="text-xs text-surface-500">
                          {tx.ID.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                        {formatCurrency(tx.Amount, tx.Currency)}
                      </p>
                      <Badge
                        variant={
                          tx.Status === "APPROVED"
                            ? "success"
                            : tx.Status === "BLOCKED"
                              ? "danger"
                              : "warning"
                        }
                        size="sm"
                      >
                        {tx.Status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-surface-500">
                No transactions yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ReactNode;
  isLoading?: boolean;
}

function StatCard({
  title,
  value,
  change,
  changeType,
  icon,
  isLoading,
}: StatCardProps) {
  if (isLoading) {
    return <CardSkeleton />;
  }

  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-surface-900 dark:text-surface-100">
            {value}
          </p>
          <div className="mt-2 flex items-center gap-1">
            {changeType === "positive" ? (
              <ArrowUpRight className="h-4 w-4 text-success-600" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-danger-600" />
            )}
            <span
              className={`text-sm font-medium ${
                changeType === "positive"
                  ? "text-success-600"
                  : "text-danger-600"
              }`}
            >
              {change}
            </span>
            <span className="text-sm text-surface-400">vs last week</span>
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
          {icon}
        </div>
      </div>
    </Card>
  );
}

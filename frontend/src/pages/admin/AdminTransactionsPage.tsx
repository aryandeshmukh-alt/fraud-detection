import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Filter } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Select,
  DataTable,
  Badge,
} from "@/components/ui";
import { adminApi } from "@/api";
import type { Transaction, TransactionFilters } from "@/types";
import {
  formatCurrency,
  formatDateTime,
  exportTransactionsToCSV,
  exportTransactionsToPDF,
} from "@/utils";

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "ID",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.ID?.slice(0, 8) || "N/A"}...
      </span>
    ),
  },
  {
    accessorKey: "UserID",
    header: "User ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.UserID?.slice(0, 8) || "N/A"}...
      </span>
    ),
  },
  {
    accessorKey: "Amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-semibold">
        {formatCurrency(row.original.Amount, row.original.Currency)}
      </span>
    ),
  },
  {
    accessorKey: "PaymentMethod",
    header: "Method",
  },
  {
    accessorKey: "Location",
    header: "Location",
  },
  {
    accessorKey: "RiskScore",
    header: "Risk",
    cell: ({ row }) => {
      const score = row.original.RiskScore;
      const variant =
        score < 30 ? "success" : score < 60 ? "warning" : "danger";
      return <Badge variant={variant}>{score}%</Badge>;
    },
  },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.Status;
      const variant =
        status === "APPROVED"
          ? "success"
          : status === "BLOCKED"
            ? "danger"
            : status === "FLAGGED"
              ? "warning"
              : "info";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "CreatedAt",
    header: "Date",
    cell: ({ row }) => formatDateTime(row.original.CreatedAt),
  },
];

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "FLAGGED", label: "Flagged" },
  { value: "BLOCKED", label: "Blocked" },
];

export default function AdminTransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 10,
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-transactions", filters],
    queryFn: () => adminApi.getTransactions(filters),
  });

  const handleExportCSV = () => {
    if (data?.data) {
      exportTransactionsToCSV(data.data);
    }
  };

  const handleExportPDF = () => {
    if (data?.data) {
      exportTransactionsToPDF(data.data);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            All Transactions
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            View and manage all user transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={<Filter className="h-4 w-4" />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={handleExportCSV}
          >
            CSV
          </Button>
          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={handleExportPDF}
          >
            PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Select
                label="Status"
                options={statusOptions}
                value={filters.status || ""}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value, page: 1 })
                }
              />
              <Input
                label="Start Date"
                type="date"
                value={filters.start_date || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    start_date: e.target.value,
                    page: 1,
                  })
                }
              />
              <Input
                label="End Date"
                type="date"
                value={filters.end_date || ""}
                onChange={(e) =>
                  setFilters({ ...filters, end_date: e.target.value, page: 1 })
                }
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setFilters({ page: 1, limit: 10 })}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card padding="none">
        <DataTable
          data={data?.data || []}
          columns={columns}
          isLoading={isLoading}
          pagination={{
            currentPage: filters.page || 1,
            totalPages: data?.total_pages || 1,
            onPageChange: (page) => setFilters({ ...filters, page }),
          }}
          emptyMessage="No transactions found"
        />
      </Card>
    </div>
  );
}

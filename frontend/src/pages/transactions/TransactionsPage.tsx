import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Filter } from "lucide-react";
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
import { transactionsApi } from "@/api";
import type { Transaction, TransactionFilters } from "@/types";
import {
  formatCurrency,
  formatDateTime,
  exportTransactionsToCSV,
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
    cell: ({ row }) => (
      <span className="capitalize">{row.original.PaymentMethod}</span>
    ),
  },
  {
    accessorKey: "Location",
    header: "Location",
  },
  {
    accessorKey: "RiskScore",
    header: "Risk Score",
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

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 10,
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => transactionsApi.getHistory(filters),
  });

  const handleExportCSV = () => {
    if (data?.data) {
      exportTransactionsToCSV(data.data);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            Transactions
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Manage and view your transaction history
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
          <div className="relative">
            <Button
              variant="outline"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={handleExportCSV}
            >
              Export
            </Button>
          </div>
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => navigate("/transactions/new")}
          >
            New Transaction
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
                label="Min Amount"
                type="number"
                placeholder="0"
                value={filters.min_amount || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    min_amount: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                    page: 1,
                  })
                }
              />
              <Input
                label="Max Amount"
                type="number"
                placeholder="100000"
                value={filters.max_amount || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    max_amount: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                    page: 1,
                  })
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

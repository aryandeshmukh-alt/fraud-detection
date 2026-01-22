import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button, Card, DataTable, Badge, Modal } from "@/components/ui";
import { adminApi } from "@/api";
import type { AuditLog } from "@/types";
import { formatDateTime, exportAuditLogsToPDF } from "@/utils";

const columns: ColumnDef<AuditLog>[] = [
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
    accessorKey: "Action",
    header: "Action",
    cell: ({ row }) => <Badge variant="info">{row.original.Action}</Badge>,
  },
  {
    accessorKey: "EntityType",
    header: "Entity Type",
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.EntityType?.toLowerCase()}
      </span>
    ),
  },
  {
    accessorKey: "EntityID",
    header: "Entity ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.EntityID?.slice(0, 8) || "N/A"}...
      </span>
    ),
  },
  {
    accessorKey: "IPAddress",
    header: "IP Address",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.IPAddress}</span>
    ),
  },
  {
    accessorKey: "CreatedAt",
    header: "Date",
    cell: ({ row }) => formatDateTime(row.original.CreatedAt),
  },
];

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs", page],
    queryFn: () => adminApi.getAuditLogs(page, 10),
  });

  const handleExportPDF = () => {
    if (data?.data) {
      exportAuditLogsToPDF(data.data);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            Audit Logs
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Track all system activities and changes
          </p>
        </div>
        <Button
          variant="outline"
          leftIcon={<Download className="h-4 w-4" />}
          onClick={handleExportPDF}
        >
          Export PDF
        </Button>
      </div>

      {/* Table */}
      <Card padding="none">
        <DataTable
          data={data?.data || []}
          columns={columns}
          isLoading={isLoading}
          onRowClick={setSelectedLog}
          pagination={{
            currentPage: page,
            totalPages: data?.total_pages || 1,
            onPageChange: setPage,
          }}
          emptyMessage="No audit logs found"
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Audit Log Details"
        size="lg"
      >
        {selectedLog && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Action
                </p>
                <Badge variant="info">{selectedLog.Action}</Badge>
              </div>
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Entity Type
                </p>
                <p className="capitalize">
                  {selectedLog.EntityType?.toLowerCase()}
                </p>
              </div>
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Entity ID
                </p>
                <p className="font-mono text-sm break-all">
                  {selectedLog.EntityID}
                </p>
              </div>
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  User ID
                </p>
                <p className="font-mono text-sm break-all">
                  {selectedLog.UserID}
                </p>
              </div>
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  IP Address
                </p>
                <p className="font-mono">{selectedLog.IPAddress}</p>
              </div>
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Date
                </p>
                <p>{formatDateTime(selectedLog.CreatedAt)}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">
                User Agent
              </p>
              <p className="text-sm bg-surface-50 dark:bg-surface-800 p-2 rounded break-all">
                {selectedLog.UserAgent}
              </p>
            </div>

            {selectedLog.OldValue && (
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">
                  Old Value
                </p>
                <pre className="text-xs bg-surface-50 dark:bg-surface-800 p-3 rounded overflow-x-auto">
                  {JSON.stringify(JSON.parse(selectedLog.OldValue), null, 2)}
                </pre>
              </div>
            )}

            {selectedLog.NewValue && (
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">
                  New Value
                </p>
                <pre className="text-xs bg-surface-50 dark:bg-surface-800 p-3 rounded overflow-x-auto">
                  {JSON.stringify(JSON.parse(selectedLog.NewValue), null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

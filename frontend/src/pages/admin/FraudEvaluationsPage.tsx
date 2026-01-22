import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, AlertTriangle } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button, Card, DataTable, Badge, Modal } from "@/components/ui";
import { adminApi } from "@/api";
import type { FraudEvaluation } from "@/types";
import { formatDateTime, exportFraudEvaluationsToPDF } from "@/utils";

const columns: ColumnDef<FraudEvaluation>[] = [
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
    accessorKey: "TransactionID",
    header: "Transaction",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.TransactionID?.slice(0, 8) || "N/A"}...
      </span>
    ),
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
    accessorKey: "Decision",
    header: "Decision",
    cell: ({ row }) => {
      const decision = row.original.Decision;
      const variant =
        decision === "APPROVED"
          ? "success"
          : decision === "BLOCKED"
            ? "danger"
            : "warning";
      return <Badge variant={variant}>{decision}</Badge>;
    },
  },
  {
    accessorKey: "RiskFactors",
    header: "Factors",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.RiskFactors?.length || 0} factors
      </span>
    ),
  },
  {
    accessorKey: "EvaluatedAt",
    header: "Evaluated At",
    cell: ({ row }) => formatDateTime(row.original.EvaluatedAt),
  },
];

export default function FraudEvaluationsPage() {
  const [page, setPage] = useState(1);
  const [selectedEvaluation, setSelectedEvaluation] =
    useState<FraudEvaluation | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["fraud-evaluations", page],
    queryFn: () => adminApi.getFraudEvaluations(page, 10),
  });

  const handleExportPDF = () => {
    if (data?.data) {
      exportFraudEvaluationsToPDF(data.data);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            Fraud Evaluations
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            View fraud detection results and risk assessments
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
          onRowClick={setSelectedEvaluation}
          pagination={{
            currentPage: page,
            totalPages: data?.total_pages || 1,
            onPageChange: setPage,
          }}
          emptyMessage="No fraud evaluations found"
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedEvaluation}
        onClose={() => setSelectedEvaluation(null)}
        title="Fraud Evaluation Details"
        size="lg"
      >
        {selectedEvaluation && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Transaction ID
                </p>
                <p className="font-mono text-sm">
                  {selectedEvaluation.TransactionID}
                </p>
              </div>
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Risk Score
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 flex-1 rounded-full bg-surface-200 dark:bg-surface-700`}
                  >
                    <div
                      className={`h-full rounded-full ${
                        selectedEvaluation.RiskScore < 30
                          ? "bg-success-500"
                          : selectedEvaluation.RiskScore < 60
                            ? "bg-warning-500"
                            : "bg-danger-500"
                      }`}
                      style={{ width: `${selectedEvaluation.RiskScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">
                    {selectedEvaluation.RiskScore}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Decision
                </p>
                <Badge
                  variant={
                    selectedEvaluation.Decision === "APPROVED"
                      ? "success"
                      : selectedEvaluation.Decision === "BLOCKED"
                        ? "danger"
                        : "warning"
                  }
                >
                  {selectedEvaluation.Decision}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Evaluated At
                </p>
                <p className="text-sm">
                  {formatDateTime(selectedEvaluation.EvaluatedAt)}
                </p>
              </div>
            </div>

            {selectedEvaluation.RiskFactors?.length > 0 && (
              <div>
                <h4 className="mb-3 font-medium text-surface-900 dark:text-surface-100">
                  Risk Factors
                </h4>
                <div className="space-y-2">
                  {selectedEvaluation.RiskFactors.map((factor, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg border p-3"
                    >
                      <AlertTriangle className="h-5 w-5 shrink-0 text-warning-600" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-surface-900 dark:text-surface-100">
                            {factor.Rule}
                          </p>
                          <Badge variant="warning" size="sm">
                            +{factor.Score}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
                          {factor.Reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

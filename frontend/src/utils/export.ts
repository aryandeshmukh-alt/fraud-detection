import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Transaction, FraudEvaluation, AuditLog } from "@/types";
import { formatDateTime, formatCurrency } from "./format";

export function exportToCSV<T extends object>(
  data: T[],
  filename: string,
  headers: { key: keyof T; label: string }[],
): void {
  const csvContent = [
    headers.map((h) => h.label).join(","),
    ...data.map((row) =>
      headers
        .map((h) => {
          const value = row[h.key];
          const stringValue = String(value ?? "");
          // Escape quotes and wrap in quotes if contains comma
          if (stringValue.includes(",") || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function exportTransactionsToCSV(transactions: Transaction[]): void {
  exportToCSV(transactions, `transactions_${Date.now()}`, [
    { key: "ID", label: "ID" },
    { key: "Amount", label: "Amount" },
    { key: "Currency", label: "Currency" },
    { key: "Location", label: "Location" },
    { key: "PaymentMethod", label: "Payment Method" },
    { key: "Status", label: "Status" },
    { key: "RiskScore", label: "Risk Score" },
    { key: "CreatedAt", label: "Created At" },
  ]);
}

export function exportTransactionsToPDF(transactions: Transaction[]): void {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Transaction Report", 14, 22);

  doc.setFontSize(10);
  doc.text(`Generated: ${formatDateTime(new Date())}`, 14, 30);

  autoTable(doc, {
    startY: 35,
    head: [["ID", "Amount", "Location", "Method", "Status", "Risk", "Date"]],
    body: transactions.map((t) => [
      t.ID?.slice(0, 8) || "N/A",
      formatCurrency(t.Amount, t.Currency),
      t.Location,
      t.PaymentMethod,
      t.Status,
      `${t.RiskScore}%`,
      formatDateTime(t.CreatedAt),
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [14, 165, 233] },
  });

  doc.save(`transactions_${Date.now()}.pdf`);
}

export function exportFraudEvaluationsToPDF(
  evaluations: FraudEvaluation[],
): void {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Fraud Evaluations Report", 14, 22);

  doc.setFontSize(10);
  doc.text(`Generated: ${formatDateTime(new Date())}`, 14, 30);

  autoTable(doc, {
    startY: 35,
    head: [
      ["Transaction ID", "Risk Score", "Decision", "Factors", "Evaluated At"],
    ],
    body: evaluations.map((e) => [
      e.TransactionID?.slice(0, 8) || "N/A",
      `${e.RiskScore}%`,
      e.Decision,
      e.RiskFactors?.map((f) => f.Rule).join(", ") || "",
      formatDateTime(e.EvaluatedAt),
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [14, 165, 233] },
  });

  doc.save(`fraud_evaluations_${Date.now()}.pdf`);
}

export function exportAuditLogsToPDF(logs: AuditLog[]): void {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Audit Logs Report", 14, 22);

  doc.setFontSize(10);
  doc.text(`Generated: ${formatDateTime(new Date())}`, 14, 30);

  autoTable(doc, {
    startY: 35,
    head: [["Action", "Entity Type", "Entity ID", "IP Address", "Created At"]],
    body: logs.map((l) => [
      l.Action,
      l.EntityType,
      l.EntityID?.slice(0, 8) || "N/A",
      l.IPAddress,
      formatDateTime(l.CreatedAt),
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [14, 165, 233] },
  });

  doc.save(`audit_logs_${Date.now()}.pdf`);
}

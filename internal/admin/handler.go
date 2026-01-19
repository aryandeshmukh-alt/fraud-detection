package admin

import (
	"strconv"

	"fraud-detection-backend/pkg/response"

	"github.com/gin-gonic/gin"
)

// GET /admin/transactions
func GetFlaggedTransactionsHandler(c *gin.Context) {
	data, err := GetFlaggedAndBlockedTransactions()
	if err != nil {
		response.Error(c, 500, "Failed to fetch transactions", err.Error())
		return
	}
	response.Success(c, "Flagged & blocked transactions", data)
}

// GET /admin/fraud-evaluations?limit=20
func GetFraudEvaluationsHandler(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	data, err := GetFraudEvaluations(limit)
	if err != nil {
		response.Error(c, 500, "Failed to fetch fraud evaluations", err.Error())
		return
	}
	response.Success(c, "Fraud evaluations fetched", data)
}

// GET /admin/audit-logs?limit=50
func GetAuditLogsHandler(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))

	data, err := GetAuditLogs(limit)
	if err != nil {
		response.Error(c, 500, "Failed to fetch audit logs", err.Error())
		return
	}
	response.Success(c, "Audit logs fetched", data)
}

export type GetDebtsSummaryResult = {
	pendingCount: number;
	paidCount: number;
	totalCount: number;

	pendingTotal: number;
	paidTotal: number;
	overallTotal: number;

	// Para la prueba: "saldo pendiente" normalmente = suma de pending
	pendingBalance: number;
};

export interface UpdateDebtCommand {
	debtorUserId: string;
	debtId: string;
	creditorName?: string;
	creditorEmail?: string | null;
	creditorPhone?: string | null;
	amount?: number;
	description?: string | null;
}

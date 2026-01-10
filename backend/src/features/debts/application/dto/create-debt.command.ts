export interface CreateDebtCommand {
	debtorUserId: string; // viene del token, NO del body
	creditorName: string;
	creditorEmail?: string | null;
	creditorPhone?: string | null;
	amount: number; // amount normal (lo convertimos a cents)
	description?: string | null;
}

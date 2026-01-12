import { Debt, DebtStatus } from '../entities/debt.entity';

export type DebtSummary = {
	pendingCount: number;
	paidCount: number;
	pendingTotal: number;
	paidTotal: number;
};

export interface DebtRepositoryPort {
	findById(id: string): Promise<Debt | null>;
	listByDebtor(debtorUserId: string, status?: DebtStatus): Promise<Debt[]>;
	save(debt: Debt): Promise<Debt>;
	deleteById(id: string): Promise<void>;
	getSummaryByDebtor(debtorUserId: string): Promise<DebtSummary>;
}
import { Debt, DebtStatus } from '../entities/debt.entity';

export interface DebtRepository {
	findById(id: string): Promise<Debt | null>;
	listByDebtor(debtorUserId: string, status?: DebtStatus): Promise<Debt[]>;
	save(debt: Debt): Promise<Debt>;
	deleteById(id: string): Promise<void>;
}
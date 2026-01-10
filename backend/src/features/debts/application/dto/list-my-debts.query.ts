import { DebtStatus } from '../../domain/entities/debt.entity';

export interface ListMyDebtsQuery {
	debtorUserId: string;
	status?: DebtStatus;
}

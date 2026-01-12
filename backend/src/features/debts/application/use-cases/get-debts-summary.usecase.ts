import type { DebtRepositoryPort } from '../../domain/ports/debt-repository.port';
import type { GetDebtsSummaryResult } from '../dto/get-debts-summary.result';

export class GetDebtsSummaryUseCase {
	constructor(private readonly repo: DebtRepositoryPort) { }

	async execute(debtorUserId: string): Promise<GetDebtsSummaryResult> {
		const s = await this.repo.getSummaryByDebtor(debtorUserId);

		return {
			pendingCount: s.pendingCount,
			paidCount: s.paidCount,
			totalCount: s.pendingCount + s.paidCount,

			pendingTotal: s.pendingTotal,
			paidTotal: s.paidTotal,
			overallTotal: s.pendingTotal + s.paidTotal,

			pendingBalance: s.pendingTotal,
		};
	}
}

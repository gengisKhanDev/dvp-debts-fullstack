import type { DebtRepositoryPort } from '../../domain/ports/debt-repository.port';
import type { CachePort } from '../ports/cache.port';
import { debtKeys } from '../cache-keys';
import type { GetDebtsSummaryResult } from '../dto/get-debts-summary.result';

export class GetDebtsSummaryUseCase {
	constructor(
		private readonly repo: DebtRepositoryPort,
		private readonly cache: CachePort,
		private readonly ttlSeconds: number, // ej: 10s
	) { }

	async execute(debtorUserId: string): Promise<GetDebtsSummaryResult> {
		const key = debtKeys.summary(debtorUserId);

		// cache hit (best-effort)
		try {
			const cached = await this.cache.get<GetDebtsSummaryResult>(key);
			if (cached) return cached;
		} catch {
			// si Redis falla, no tumbes el endpoint
		}

		// cache miss -> DB
		const s = await this.repo.getSummaryByDebtor(debtorUserId);

		const result: GetDebtsSummaryResult = {
			pendingCount: s.pendingCount,
			paidCount: s.paidCount,
			totalCount: s.pendingCount + s.paidCount,

			pendingTotal: s.pendingTotal,
			paidTotal: s.paidTotal,
			overallTotal: s.pendingTotal + s.paidTotal,

			pendingBalance: s.pendingTotal,
		};

		// set cache con TTL corto
		try {
			await this.cache.set(key, result, this.ttlSeconds);
		} catch {
			// ignore
		}

		return result;
	}
}

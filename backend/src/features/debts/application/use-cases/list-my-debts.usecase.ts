import { DebtRepository } from '../../domain/ports/debt-repository.port';
import type { CachePort } from '../ports/cache.port';
import { debtKeys } from '../cache-keys';
import { ListMyDebtsQuery } from '../dto/list-my-debts.query';

export class ListMyDebtsUseCase {
	constructor(
		private readonly debts: DebtRepository,
		private readonly cache: CachePort,
		private readonly ttlSeconds: number,
	) { }

	async execute(q: ListMyDebtsQuery) {
		const key = debtKeys.list(q.debtorUserId, q.status);

		const cached = await this.cache.get<any[]>(key);
		if (cached) return cached;

		const rows = await this.debts.listByDebtor(q.debtorUserId, q.status);
		const result = rows.map((d) => ({
			id: d.id,
			creditorName: d.creditorName,
			creditorEmail: d.creditorEmail,
			creditorPhone: d.creditorPhone,
			amount: d.amount.toAmount(),
			description: d.description,
			status: d.status,
			createdAt: d.createdAt.toISOString(),
			updatedAt: d.updatedAt.toISOString(),
			paidAt: d.paidAt?.toISOString() ?? null,
		}));

		await this.cache.set(key, result, this.ttlSeconds);
		return result;
	}
}

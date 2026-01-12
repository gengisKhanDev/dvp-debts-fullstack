import { DebtRepositoryPort } from '../../domain/ports/debt-repository.port';
import type { CachePort } from '../ports/cache.port';
import { debtKeys } from '../cache-keys';

export class GetMyDebtUseCase {
	constructor(
		private readonly debts: DebtRepositoryPort,
		private readonly cache: CachePort,
		private readonly ttlSeconds: number,
	) { }

	async execute(debtorUserId: string, debtId: string) {
		const key = debtKeys.detail(debtorUserId, debtId);

		const cached = await this.cache.get<any>(key);
		if (cached) return cached;

		const d = await this.debts.findById(debtId);
		if (!d) throw new Error('DebtNotFound');
		if (d.debtorUserId !== debtorUserId) throw new Error('Forbidden');

		const result = {
			id: d.id,
			debtorUserId: d.debtorUserId,
			creditorName: d.creditorName,
			creditorEmail: d.creditorEmail,
			creditorPhone: d.creditorPhone,
			amount: d.amount.toAmount(),
			description: d.description,
			status: d.status,
			createdAt: d.createdAt.toISOString(),
			updatedAt: d.updatedAt.toISOString(),
			paidAt: d.paidAt?.toISOString() ?? null,
		};

		await this.cache.set(key, result, this.ttlSeconds);
		return result;
	}
}

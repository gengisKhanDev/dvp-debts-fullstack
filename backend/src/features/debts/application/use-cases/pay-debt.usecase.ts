import { DebtRepositoryPort } from '../../domain/ports/debt-repository.port';
import type { CachePort } from '../ports/cache.port';
import { debtKeys } from '../cache-keys';

export class PayDebtUseCase {
	constructor(
		private readonly debts: DebtRepositoryPort,
		private readonly cache: CachePort,
	) { }

	async execute(debtorUserId: string, debtId: string) {
		const d = await this.debts.findById(debtId);
		if (!d) throw new Error('DebtNotFound');
		if (d.debtorUserId !== debtorUserId) throw new Error('Forbidden');

		d.markPaid(new Date());

		await this.debts.save(d);

		await this.cache.del([
			...debtKeys.listsToInvalidate(debtorUserId),
			debtKeys.detail(debtId),
		]);

		return { ok: true };
	}
}

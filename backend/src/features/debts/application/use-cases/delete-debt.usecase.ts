import { DebtRepository } from '../../domain/ports/debt-repository.port';
import type { CachePort } from '../ports/cache.port';
import { debtKeys } from '../cache-keys';

export class DeleteDebtUseCase {
	constructor(
		private readonly debts: DebtRepository,
		private readonly cache: CachePort,
	) { }

	async execute(debtorUserId: string, debtId: string) {
		const d = await this.debts.findById(debtId);
		if (!d) throw new Error('DebtNotFound');
		if (d.debtorUserId !== debtorUserId) throw new Error('Forbidden');

		d.ensureMutable();
		await this.debts.deleteById(debtId);

		await this.cache.del([
			...debtKeys.listsToInvalidate(debtorUserId),
			debtKeys.detail(debtId),
		]);

		return { ok: true };
	}
}

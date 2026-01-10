import { DebtRepository } from '../../domain/ports/debt-repository.port';
import { Money } from '../../domain/value-objects/money.vo';
import type { CachePort } from '../ports/cache.port';
import { debtKeys } from '../cache-keys';
import { UpdateDebtCommand } from '../dto/update-debt.command';

export class UpdateDebtUseCase {
	constructor(
		private readonly debts: DebtRepository,
		private readonly cache: CachePort,
	) { }

	async execute(cmd: UpdateDebtCommand) {
		const d = await this.debts.findById(cmd.debtId);
		if (!d) throw new Error('DebtNotFound');
		if (d.debtorUserId !== cmd.debtorUserId) throw new Error('Forbidden');

		d.ensureMutable();

		const now = new Date();
		if (cmd.creditorName !== undefined) d.creditorName = cmd.creditorName.trim();
		if (cmd.creditorEmail !== undefined) d.creditorEmail = cmd.creditorEmail?.trim() ?? null;
		if (cmd.creditorPhone !== undefined) d.creditorPhone = cmd.creditorPhone?.trim() ?? null;
		if (cmd.description !== undefined) d.description = cmd.description?.trim() ?? null;
		if (cmd.amount !== undefined) d.amount = Money.fromAmount(cmd.amount);

		d.updatedAt = now;

		await this.debts.save(d);

		await this.cache.del([
			...debtKeys.listsToInvalidate(cmd.debtorUserId),
			debtKeys.detail(cmd.debtId),
		]);

		return { ok: true };
	}
}

import { randomUUID } from 'crypto';
import { Debt } from '../../domain/entities/debt.entity';
import { DebtRepositoryPort } from '../../domain/ports/debt-repository.port';
import { Money } from '../../domain/value-objects/money.vo';
import { debtKeys } from '../cache-keys';
import type { CachePort } from '../ports/cache.port';
import { CreateDebtCommand } from '../dto/create-debt.command';

export class CreateDebtUseCase {
	constructor(
		private readonly debts: DebtRepositoryPort,
		private readonly cache: CachePort,
	) { }

	async execute(cmd: CreateDebtCommand) {
		const now = new Date();
		const amount = Money.fromAmount(cmd.amount);

		const debt = new Debt(
			randomUUID(),
			cmd.debtorUserId,
			cmd.creditorName.trim(),
			cmd.creditorEmail?.trim() ?? null,
			cmd.creditorPhone?.trim() ?? null,
			amount,
			cmd.description?.trim() ?? null,
			'PENDING',
			now,
			now,
			null,
		);

		await this.debts.save(debt);

		await this.cache.del(debtKeys.readsToInvalidateOnWrite(cmd.debtorUserId));

		return { id: debt.id };
	}
}

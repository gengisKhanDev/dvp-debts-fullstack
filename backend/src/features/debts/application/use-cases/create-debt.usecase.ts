import { randomUUID } from 'crypto';
import { Debt } from '../../domain/entities/debt.entity';
import { DebtRepository } from '../../domain/ports/debt-repository.port';
import { Money } from '../../domain/value-objects/money.vo';
import { CreateDebtCommand } from '../dto/create-debt.command';

export class CreateDebtUseCase {
	constructor(private readonly debts: DebtRepository) { }

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

		return { id: debt.id };
	}
}

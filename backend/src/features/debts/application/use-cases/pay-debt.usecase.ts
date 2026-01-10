import { DebtRepository } from '../../domain/ports/debt-repository.port';

export class PayDebtUseCase {
	constructor(private readonly debts: DebtRepository) { }

	async execute(debtorUserId: string, debtId: string) {
		const d = await this.debts.findById(debtId);
		if (!d) throw new Error('DebtNotFound');
		if (d.debtorUserId !== debtorUserId) throw new Error('Forbidden');

		d.markPaid(new Date());

		await this.debts.save(d);
		return { ok: true };
	}
}

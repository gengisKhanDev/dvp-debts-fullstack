import { DebtRepository } from '../../domain/ports/debt-repository.port';

export class DeleteDebtUseCase {
	constructor(private readonly debts: DebtRepository) { }

	async execute(debtorUserId: string, debtId: string) {
		const d = await this.debts.findById(debtId);
		if (!d) throw new Error('DebtNotFound');
		if (d.debtorUserId !== debtorUserId) throw new Error('Forbidden');

		d.ensureMutable();
		await this.debts.deleteById(debtId);
		return { ok: true };
	}
}

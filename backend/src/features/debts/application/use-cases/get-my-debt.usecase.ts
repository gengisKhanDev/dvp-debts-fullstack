import { DebtRepository } from '../../domain/ports/debt-repository.port';

export class GetMyDebtUseCase {
	constructor(private readonly debts: DebtRepository) { }

	async execute(debtorUserId: string, debtId: string) {
		const d = await this.debts.findById(debtId);
		if (!d) throw new Error('DebtNotFound');
		if (d.debtorUserId !== debtorUserId) throw new Error('Forbidden');

		return {
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
		};
	}
}

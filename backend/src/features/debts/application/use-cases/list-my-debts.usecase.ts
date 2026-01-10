import { DebtRepository } from '../../domain/ports/debt-repository.port';
import { ListMyDebtsQuery } from '../dto/list-my-debts.query';

export class ListMyDebtsUseCase {
	constructor(private readonly debts: DebtRepository) { }

	async execute(q: ListMyDebtsQuery) {
		const rows = await this.debts.listByDebtor(q.debtorUserId, q.status);
		// response “application-friendly”
		return rows.map((d) => ({
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
	}
}

import { Money } from '../value-objects/money.vo';

export type DebtStatus = 'PENDING' | 'PAID';

export class Debt {
	constructor(
		public readonly id: string,
		public readonly debtorUserId: string,
		public creditorName: string,
		public creditorEmail: string | null,
		public creditorPhone: string | null,
		public amount: Money,
		public description: string | null,
		public status: DebtStatus,
		public createdAt: Date,
		public updatedAt: Date,
		public paidAt: Date | null,
	) { }

	isPaid(): boolean {
		return this.status === 'PAID';
	}

	markPaid(now: Date) {
		if (this.isPaid()) throw new Error('DebtAlreadyPaid');
		this.status = 'PAID';
		this.paidAt = now;
		this.updatedAt = now;
	}

	ensureMutable() {
		if (this.isPaid()) throw new Error('PaidDebtCannotBeModified');
	}
}

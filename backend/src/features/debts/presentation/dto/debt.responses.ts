export class CreateDebtResponse {
	/**
	 * Created debt id (uuid).
	 * @example "5e6a745b-530e-4236-8427-9351dba405bf"
	 */
	id!: string;
}

export class DebtResponse {
	/**
	 * Debt id (uuid).
	 * @example "5e6a745b-530e-4236-8427-9351dba405bf"
	 */
	id!: string;

	/**
	 * Creditor name.
	 * @example "Juan"
	 */
	creditorName!: string;

	/**
	 * Creditor email (nullable).
	 * @example "juan@test.com"
	 */
	creditorEmail!: string | null;

	/**
	 * Creditor phone (nullable).
	 * @example "300123123"
	 */
	creditorPhone!: string | null;

	/**
	 * Debt amount.
	 * @example 12.5
	 */
	amount!: number;

	/**
	 * Description (nullable).
	 * @example "pizza"
	 */
	description!: string | null;

	/**
	 * Current status.
	 * @example "PENDING"
	 */
	status!: 'PENDING' | 'PAID';

	/**
	 * ISO date.
	 * @example "2026-01-10T03:56:09.941Z"
	 */
	createdAt!: string;

	/**
	 * ISO date.
	 * @example "2026-01-10T03:56:09.941Z"
	 */
	updatedAt!: string;

	/**
	 * ISO date when paid (nullable).
	 * @example null
	 */
	paidAt!: string | null;
}

export class DebtSummaryResponse {
	/** Cantidad de deudas pendientes */
	pendingCount!: number;

	/** Cantidad de deudas pagadas */
	paidCount!: number;

	/** Total de deudas (pending + paid) */
	totalCount!: number;

	/** Suma de amounts en PENDING */
	pendingTotal!: number;

	/** Suma de amounts en PAID */
	paidTotal!: number;

	/** Suma total (pendingTotal + paidTotal) */
	overallTotal!: number;

	/** Saldo pendiente (equivale a pendingTotal) */
	pendingBalance!: number;
}

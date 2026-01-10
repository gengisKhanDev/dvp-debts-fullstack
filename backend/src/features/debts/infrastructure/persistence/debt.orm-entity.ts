import { Entity, Column, PrimaryColumn, Check, Index } from 'typeorm';

@Entity('debts')
@Check(`"amount_cents" >= 0`)
@Check(`"status" IN ('PENDING','PAID')`)
@Index(['debtorUserId', 'status'])
export class DebtOrmEntity {
	@PrimaryColumn('uuid')
	id!: string;

	@Column({ name: 'debtor_user_id', type: 'uuid' })
	debtorUserId!: string;

	@Column({ name: 'creditor_name', type: 'varchar', length: 120 })
	creditorName!: string;

	// ✅ IMPORTANT: especificar type para evitar design:type Object
	@Column({ name: 'creditor_email', type: 'varchar', length: 254, nullable: true })
	creditorEmail!: string | null;

	@Column({ name: 'creditor_phone', type: 'varchar', length: 32, nullable: true })
	creditorPhone!: string | null;

	@Column({ name: 'amount_cents', type: 'int' })
	amountCents!: number;

	@Column({ name: 'description', type: 'text', nullable: true })
	description!: string | null;

	@Column({ type: 'varchar' })
	status!: 'PENDING' | 'PAID';

	@Column({ name: 'created_at', type: 'timestamptz' })
	createdAt!: Date;

	@Column({ name: 'updated_at', type: 'timestamptz' })
	updatedAt!: Date;

	@Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
	paidAt!: Date | null;
}

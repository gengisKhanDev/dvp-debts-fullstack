import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Debt, DebtStatus } from '../../domain/entities/debt.entity';
import { DebtRepositoryPort, DebtSummary } from '../../domain/ports/debt-repository.port';
import { Money } from '../../domain/value-objects/money.vo';
import { DebtOrmEntity } from './debt.orm-entity';

@Injectable()
export class DebtRepositoryPgAdapter implements DebtRepositoryPort {
	constructor(
		@InjectRepository(DebtOrmEntity)
		private readonly repo: Repository<DebtOrmEntity>,
	) { }

	async findById(id: string): Promise<Debt | null> {
		const row = await this.repo.findOne({ where: { id } });
		return row ? this.toDomain(row) : null;
	}

	async listByDebtor(debtorUserId: string, status?: DebtStatus): Promise<Debt[]> {
		const rows = await this.repo.find({
			where: status ? { debtorUserId, status } : { debtorUserId },
			order: { createdAt: 'DESC' },
		});
		return rows.map((r) => this.toDomain(r));
	}

	async save(debt: Debt): Promise<Debt> {
		const row = this.repo.create({
			id: debt.id,
			debtorUserId: debt.debtorUserId,
			creditorName: debt.creditorName,
			creditorEmail: debt.creditorEmail,
			creditorPhone: debt.creditorPhone,
			amountCents: debt.amount.cents,
			description: debt.description,
			status: debt.status,
			createdAt: debt.createdAt,
			updatedAt: debt.updatedAt,
			paidAt: debt.paidAt,
		});
		await this.repo.save(row);
		return debt;
	}

	async deleteById(id: string): Promise<void> {
		await this.repo.delete({ id });
	}

	private toDomain(row: DebtOrmEntity): Debt {
		return new Debt(
			row.id,
			row.debtorUserId,
			row.creditorName,
			row.creditorEmail,
			row.creditorPhone,
			Money.fromCents(row.amountCents),
			row.description,
			row.status,
			row.createdAt,
			row.updatedAt,
			row.paidAt,
		);
	}
	async getSummaryByDebtor(debtorUserId: string): Promise<DebtSummary> {
		const raw = await this.repo
			.createQueryBuilder('d')
			.select(
				'COALESCE(SUM(CASE WHEN d.status = :pending THEN d.amount ELSE 0 END), 0)',
				'pendingTotal',
			)
			.addSelect(
				'COALESCE(SUM(CASE WHEN d.status = :paid THEN d.amount ELSE 0 END), 0)',
				'paidTotal',
			)
			.addSelect(
				'COALESCE(SUM(CASE WHEN d.status = :pending THEN 1 ELSE 0 END), 0)',
				'pendingCount',
			)
			.addSelect(
				'COALESCE(SUM(CASE WHEN d.status = :paid THEN 1 ELSE 0 END), 0)',
				'paidCount',
			)
			.where('d.debtorUserId = :debtorUserId', { debtorUserId })
			.setParameters({ pending: 'PENDING', paid: 'PAID' })
			.getRawOne<{
				pendingTotal: string;
				paidTotal: string;
				pendingCount: string;
				paidCount: string;
			}>();

		// Nota: en Postgres, agregaciones (SUM/COUNT) suelen venir como string en raw results,
		// por eso convertimos a Number. :contentReference[oaicite:2]{index=2}
		return {
			pendingTotal: Number(raw?.pendingTotal ?? 0),
			paidTotal: Number(raw?.paidTotal ?? 0),
			pendingCount: Number(raw?.pendingCount ?? 0),
			paidCount: Number(raw?.paidCount ?? 0),
		};
	}
}
